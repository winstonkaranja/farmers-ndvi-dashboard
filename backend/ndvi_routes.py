from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.file_upload import get_db
from backend.models import UploadedFile, NDVIResult, Project
import os
from uuid import uuid4
from backend.ndvi_processor import process_ndvi_pipeline, simple_tiff_to_jpeg, extract_s3_key_from_url
from backend.s3_utils import upload_to_s3
from geoalchemy2.shape import from_shape
from shapely.geometry import box
import rasterio
from typing import List
from backend.schemas import ProjectCreate, ProjectRead
from datetime import datetime
from opencage.geocoder import OpenCageGeocode
from backend.mars_client import run_mars_insights

router = APIRouter()

@router.get("/ndvi-data")
def get_ndvi_data(db: Session = Depends(get_db)):
    images = db.query(UploadedFile).order_by(UploadedFile.uploaded_at.desc()).all()
    return [
        {
            "id": img.id,
            "date": img.uploaded_at.strftime("%B %d, %Y"),
            "filename": img.filename,
            "url": img.s3_url,
            "ndviMin": -0.2,  # You can replace with real values if computed
            "ndviMax": 0.8,
            "ndviMean": 0.45,
            "healthyPercentage": 65,
            "stressedPercentage": 25,
            "unhealthyPercentage": 10,
        }
        for img in images
    ]


@router.post("/projects/{project_id}/ndvi-process")
async def process_ndvi(
    project_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    results_list = []

    for file in files:
        if not (file.filename.endswith(".tif") or file.filename.endswith(".tiff")):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a TIFF")

        try:
            # Save the uploaded file to disk temporarily
            temp_filename = f"temp_{uuid4().hex}_{file.filename}"
            with open(temp_filename, "wb") as f:
                f.write(await file.read())

            print("TEMP FILE PATH:", temp_filename)
            print("Does file exist?", os.path.exists(temp_filename))
            print("Calling process_ndvi_pipeline with path:", temp_filename)

            # Run NDVI analysis
            ndvi_result = process_ndvi_pipeline(
                ref_image_path=temp_filename,
                target_image_path=temp_filename,
                nir_band_index=3,
                red_band_index=2,
            )
            
            ndvi_path = ndvi_result["ndvi_path"]
            stats = ndvi_result["stats"]
            bounds = ndvi_result["extent"]
            
            # --- Convert TIFF to JPEG ---
            jpeg_preview_path = f"preview_{uuid4().hex}.jpg"
            simple_tiff_to_jpeg(temp_filename, jpeg_preview_path)

            # Upload JPEG preview to S3
            jpeg_s3_filename = f"previews/{datetime.utcnow().isoformat()}_{file.filename.replace('.tif', '.jpg').replace('.tiff', '.jpg')}"
            jpeg_s3_url = upload_to_s3(jpeg_preview_path, jpeg_s3_filename)
            
            # Upload user image to s3
            tiff_s3_filename = f"ndvi_results/{datetime.utcnow().isoformat()}_{file.filename}"
            tiff_s3_url = upload_to_s3(temp_filename, tiff_s3_filename)

            # Upload NDVI result to S3
            s3_filename = f"ndvi_corrected_results/{datetime.utcnow().isoformat()}_{file.filename}"
            s3_url = upload_to_s3(ndvi_path, s3_filename)

            original_s3_filename = f"originals/{datetime.utcnow().isoformat()}_{file.filename}"
            original_s3_url = upload_to_s3(temp_filename, original_s3_filename)

            # Convert bounds to polygon (shapely)
            minx, miny, maxx, maxy = bounds.bounds
            polygon = box(minx, miny, maxx, maxy)
            raster_geom = from_shape(polygon, srid=4326)

            # Store metadata
            result = NDVIResult(
                filename=file.filename,
                s3_url=s3_url,
                original_url=jpeg_s3_url,
                tiff_url=tiff_s3_url, 
                ndvi_min=stats["min"],
                ndvi_max=stats["max"],
                ndvi_mean=stats["mean"],
                raster_extent=raster_geom,
                timestamp=datetime.utcnow(),
                project_id=project_id
            )
            db.add(result)
            db.commit()
            db.refresh(result)

            results_list.append({
                "id": result.id,
                "filename": result.filename,
                "s3_url": result.s3_url,
                "ndvi_min": result.ndvi_min,
                "ndvi_max": result.ndvi_max,
                "ndvi_mean": result.ndvi_mean,
                "timestamp": result.timestamp.isoformat()
            })

            # Cleanup
            os.remove(temp_filename)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return results_list

    
@router.get("/projects/{project_id}/timeline")
def get_project_timeline(project_id: int, db: Session = Depends(get_db)):
    results = db.query(NDVIResult).filter(NDVIResult.project_id == project_id).order_by(NDVIResult.timestamp.desc()).all()

    timeline = []
    for r in results:
        timeline.append({
            "id": r.id,
            "date": r.timestamp.strftime("%B %d, %Y"),
            "title": "NDVI Analysis",
            "description": f"NDVI processed for file {r.filename}",
            "files": [r.filename],
        })

    return timeline


@router.get("/projects/{project_id}/ndvi")
def get_project_ndvi_results(project_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(NDVIResult)
        .filter(NDVIResult.project_id == project_id)
        .order_by(NDVIResult.timestamp.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "date": r.timestamp.strftime("%B %d, %Y"),
            "url": r.s3_url,
            "originalUrl": r.original_url,  
            "ndviMin": r.ndvi_min,
            "ndviMax": r.ndvi_max,
            "ndviMean": r.ndvi_mean,
            "healthyPercentage": 65,   # Placeholder
            "stressedPercentage": 25,  # Placeholder
            "unhealthyPercentage": 10, # Placeholder
        }
        for r in results
    ]


   
@router.post("/projects", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project    

@router.get("/projects/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    latest_ndvi = (
        db.query(NDVIResult)
        .filter(NDVIResult.project_id == project_id)
        .order_by(NDVIResult.timestamp.desc())
        .first()
    )

    # None if no NDVI found
    latest_image_key = None

    if latest_ndvi:
        if latest_ndvi.tiff_url and (latest_ndvi.tiff_url.endswith(".tif") or latest_ndvi.tiff_url.endswith(".tiff")):
            latest_image_key = extract_s3_key_from_url(latest_ndvi.tiff_url)

    return {
        "id": project.id,
        "name": project.name,
        "location": project.location,
        "description": project.description,
        "created_at": project.created_at,
        "latest_image_key": latest_image_key,
    }


@router.get("/projects")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "location": p.location,
            "description": p.description,
            "created_at": p.created_at.isoformat(),
        }
        for p in projects
    ]
    

@router.get("/geocode")
def get_coordinates(location: str):
    try:
        api_key = os.getenv("OPENCAGE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenCage API key not configured")

        geocoder = OpenCageGeocode(api_key)
        results = geocoder.geocode(location)

        if results and len(results) > 0:
            lat = results[0]['geometry']['lat']
            lng = results[0]['geometry']['lng']
            return {"latitude": lat, "longitude": lng}
        else:
            return {"latitude": None, "longitude": None}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai-insights")
async def run_ai_insights(payload: dict):
    try:
        result = await run_mars_insights(payload)
        return {"result": result} 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))