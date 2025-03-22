
# University Management System

This project is a University Management System with a React frontend and FastAPI backend.

## Project Structure

- `/src`: React frontend code
- `/backend`: FastAPI backend code

## Getting Started

### Frontend

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

### Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Start the server:
```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000 and the API documentation at http://localhost:8000/docs.

## Features

- User management (students, teachers, admins)
- Course management
- Assignment tracking
- Lecture scheduling
- Announcements system
- Role-based access control

## Technologies Used

### Frontend
- React
- TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui
- React Router

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite (for development)
