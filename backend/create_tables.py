from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Import models after declaring Base
from models import Project, NDVIResult, UploadedFile

# Now create tables
Base.metadata.create_all(bind=engine)
print("✅ All tables created")
