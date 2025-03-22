
# University Management API

A FastAPI backend for the University Management System.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Start the server:
   ```
   uvicorn main:app --reload
   ```

3. API Documentation:
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

## Environment Variables

Create a `.env` file in the root directory with these variables:
- `DATABASE_URL`: Connection string for your database (defaults to SQLite)
