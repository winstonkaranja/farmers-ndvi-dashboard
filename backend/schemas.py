# backend/schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# --- PROJECT SCHEMAS ---

class ProjectCreate(BaseModel):
    name: str
    location: str
    description: str
    latitude: float
    longitude: float


class ProjectRead(ProjectCreate):
    id: int
    created_at: datetime  

    class Config:
        orm_mode = True


# --- NDVI RESULT SCHEMAS (Optional, for future integration) ---

class NDVIResultRead(BaseModel):
    id: int
    filename: str
    s3_url: str
    ndvi_min: float
    ndvi_max: float
    ndvi_mean: float
    timestamp: datetime

    class Config:
        orm_mode = True
