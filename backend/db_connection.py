from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DATABASE_ENDPOINT"),
    port="5432"
)

cursor = conn.cursor()
cursor.execute("SELECT NOW();")
print(cursor.fetchone())
