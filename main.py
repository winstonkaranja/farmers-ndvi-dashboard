from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.models import UploadedFile
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
import boto3
import os
from uuid import uuid4
from typing import List
from io import BytesIO  

from backend.ndvi_routes import router as ndvi_router
from backend.image_routes import router as project_router

# FastAPI app
app = FastAPI()
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ndvi_router)
app.include_router(project_router)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def health_check():
    return {"status": "running"}


# Upload endpoint
@app.post("/upload/")
async def upload_file(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
        region_name=os.getenv("AWS_REGION"),
    )
    bucket_name = os.getenv("AWS_BUCKET_NAME")
    uploaded_data = []

    for file in files:
        contents = await file.read()
        filename = f"{uuid4()}_{file.filename}"

        # ✅ Wrap the content in BytesIO so it acts like a file
        file_obj = BytesIO(contents)

        s3.upload_fileobj(
            Fileobj=file_obj,
            Bucket=bucket_name,
            Key=filename,
            ExtraArgs={"ContentType": file.content_type},
        )

        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"

        # Save metadata in the database
        db_file = UploadedFile(
            filename=file.filename,
            content_type=file.content_type,
            s3_url=s3_url
        )
        db.add(db_file)

        uploaded_data.append({
            "original_filename": file.filename,
            "s3_url": s3_url,
        })

    db.commit()

    return {"files": uploaded_data}
