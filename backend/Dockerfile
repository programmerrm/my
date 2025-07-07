# Step 1: Base image
FROM python:3.13-slim

# Step 2: Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VIRTUALENVS_CREATE=false

# Step 3: Set working directory
WORKDIR /app

# Step 4: Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    netcat-openbsd \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Step 5: Copy dependency file & install
COPY ./requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Step 6: Copy project source
COPY . .

# Step 7: Add wait-for-db script
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Step 8: Run Gunicorn with wait-for-db.sh
CMD ["/wait-for-db.sh", "gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000", "--workers=4", "--threads=2", "--timeout=120"]