from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.file_upload import get_db
from backend.models import UploadedFile  # or ImageMetadata depending on your table

router = APIRouter()

@router.get("/project-images/")
def get_project_images(db: Session = Depends(get_db)):
    images = db.query(UploadedFile).all()
    return [
        {
            "id": img.id,
            "filename": img.filename,
            "s3_url": img.s3_url,
            "upload_time": img.uploaded_at
        }
        for img in images
    ]
