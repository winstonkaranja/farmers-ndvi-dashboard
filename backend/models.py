from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base
from datetime import datetime


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    content_type = Column(String)
    s3_url = Column(String)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    description = Column(String)
    latitude = Column(Float) 
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    ndvi_results = relationship("NDVIResult", back_populates="project")


class NDVIResult(Base):
    __tablename__ = "ndvi_results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    s3_url = Column(String, nullable=False)             
    original_url = Column(String, nullable=False)       
    tiff_url = Column(String, nullable=True)             

    ndvi_min = Column(Float)
    ndvi_max = Column(Float)
    ndvi_mean = Column(Float)

    raster_extent = Column(Geometry("POLYGON"))
    timestamp = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    project = relationship("Project", back_populates="ndvi_results")