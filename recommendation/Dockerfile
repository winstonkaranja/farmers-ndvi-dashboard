FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libglib2.0-0 git && \
    rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy app files
COPY . /app

# Install dependencies
# RUN pip install --upgrade pip
RUN pip install --default-timeout=100 -r requirements.txt

COPY . .

# Default command (you can change this for production mode)
CMD ["uvicorn", "recommendation:advisor_graph.app", "--host", "0.0.0.0", "--port", "8000"]
