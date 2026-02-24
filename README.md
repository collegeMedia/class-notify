
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

- **Authentication System**: JWT token-based authentication with password hashing
- **Role-Based Access Control**: Separate login portals for students, teachers, and admins
- **Department Management**: Create and manage academic departments
- **Subject Management**: Create subjects and enroll students
- **Chat Groups**: Subject-based chat groups where:
  - Each subject has one chat group
  - Subject teacher is automatically the group admin
  - Only enrolled students can be group members
  - Members can send and view messages
- **Assignment Tracking**: Create and manage assignments with due dates
- **Lecture Scheduling**: Schedule and manage lectures
- **Announcements System**: Department-wide announcements
- **User Management**: Admin-only user creation and management

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
- PostgreSQL (via Docker)
- Alembic (database migrations)
- JWT authentication (python-jose)
- Password hashing (passlib, bcrypt)

## Default Credentials

### Admin Account
- Email: `admin@university.edu`
- Password: `admin123`
- Access: Full system access including Admin Panel

### Teacher Account
- Email: `john.smith@university.edu` or `jane.doe@university.edu`
- Password: `password123`
- Access: View content, manage subjects and chat groups

### Student Account
- Email: `john.doe@university.edu`
- Password: `password123`
- Access: View content, participate in enrolled chat groups

## Login Portals

The system provides three separate login portals:

1. **`/login`** - Role selection page
2. **`/login/student`** - Student portal (Blue theme)
3. **`/login/teacher`** - Teacher portal (Green theme)
4. **`/login/admin`** - Admin portal (Amber theme)

Each portal validates the user's role and redirects appropriately.

## Chat Group System

### How It Works

1. **Subject Creation**: Admin creates a subject with a professor
2. **Student Enrollment**: Admin/Teacher enrolls students in the subject
3. **Chat Group Creation**: When a chat group is created for a subject:
   - The subject's professor becomes the chat group admin
   - All enrolled students are automatically added as members
4. **Messaging**: Only chat group members (teacher + enrolled students) can send/view messages

### API Endpoints

**Enrollment:**
- `POST /subjects/{subject_id}/enroll/{student_id}` - Enroll a student
- `DELETE /subjects/{subject_id}/enroll/{student_id}` - Unenroll a student
- `GET /subjects/{subject_id}/students` - Get enrolled students
- `GET /students/{student_id}/subjects` - Get student's subjects

**Chat Groups:**
- `POST /chat-groups/` - Create chat group (Teacher/Admin only)
- `GET /chat-groups/teacher/{teacher_id}` - Get teacher's chat groups
- `GET /chat-groups/student/{student_id}` - Get student's chat groups
- `GET /chat-groups/{chat_group_id}` - Get chat group details with members
- `POST /chat-groups/{chat_group_id}/members/{user_id}` - Add member (Teacher/Admin only)
- `DELETE /chat-groups/{chat_group_id}/members/{user_id}` - Remove member (Teacher/Admin only)

**Messages:**
- `POST /messages/` - Send message (Members only)
- `GET /messages/{chat_group_id}` - Get messages (Members only)
