from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import boto3
import os
import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

DB_URL = os.getenv("DATABASE_URL")  # Example: "postgresql://user:password@host:port/dbname"

# Initialize FastAPI app
app = FastAPI()

# Configure database
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ImageMetadata(Base):
    __tablename__ = "image_metadata"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    s3_url = Column(String)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Configure S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not (file.filename.endswith(".tif") or file.filename.endswith(".tiff")):
        raise HTTPException(status_code=400, detail="Only TIFF files are allowed")
    
    try:
        # Generate unique filename
        s3_filename = f"uploads/{datetime.datetime.utcnow().isoformat()}_{file.filename}"
        
        # Upload to S3
        s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, s3_filename)
        
        # Construct S3 file URL
        s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{s3_filename}"
        
        # Save metadata to RDS
        image_metadata = ImageMetadata(filename=file.filename, s3_url=s3_url)
        db.add(image_metadata)
        db.commit()
        
        return {"filename": file.filename, "s3_url": s3_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
