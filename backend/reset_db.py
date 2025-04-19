# backend/reset_db.py
from database import engine, Base
from models import UploadedFile, NDVIResult, Project

# Drop all tables
Base.metadata.drop_all(bind=engine)
print("🔴 Tables dropped")

# Recreate all tables
Base.metadata.create_all(bind=engine)
print("✅ Tables recreated")
