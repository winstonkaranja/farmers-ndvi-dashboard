import boto3
from dotenv import load_dotenv
import os

load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION")
)

s3.upload_file("/home/karen/Documents/farmers-ndvi-dashboard/backend/20180627_seq_50m_NC.tif", "ndvi-images-bucket", "drone_image.tiff")
print("Upload successful!")



