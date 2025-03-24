from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="University Management API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "University Management API is running"}

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Assignment endpoints
@app.post("/assignments/", response_model=schemas.Assignment)
def create_assignment(assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    return crud.create_assignment(db=db, assignment=assignment)

@app.get("/assignments/", response_model=List[schemas.Assignment])
def read_assignments(
    department: Optional[str] = None, 
    semester: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    assignments = crud.get_assignments(db, skip=skip, limit=limit, department=department, semester=semester)
    return assignments

@app.get("/assignments/{assignment_id}", response_model=schemas.Assignment)
def read_assignment(assignment_id: str, db: Session = Depends(get_db)):
    db_assignment = crud.get_assignment(db, assignment_id=assignment_id)
    if db_assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return db_assignment

# Lecture endpoints
@app.post("/lectures/", response_model=schemas.Lecture)
def create_lecture(lecture: schemas.LectureCreate, db: Session = Depends(get_db)):
    return crud.create_lecture(db=db, lecture=lecture)

@app.get("/lectures/", response_model=List[schemas.Lecture])
def read_lectures(
    department: Optional[str] = None, 
    semester: Optional[str] = None,
    date: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    lectures = crud.get_lectures(db, skip=skip, limit=limit, department=department, semester=semester, date=date)
    return lectures

# Subject endpoints
@app.post("/subjects/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    return crud.create_subject(db=db, subject=subject)

@app.get("/subjects/", response_model=List[schemas.Subject])
def read_subjects(
    department: Optional[str] = None, 
    semester: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    subjects = crud.get_subjects(db, skip=skip, limit=limit, department=department, semester=semester)
    return subjects

# Announcement endpoints
@app.post("/announcements/", response_model=schemas.Announcement)
def create_announcement(announcement: schemas.AnnouncementCreate, db: Session = Depends(get_db)):
    return crud.create_announcement(db=db, announcement=announcement)

@app.get("/announcements/", response_model=List[schemas.Announcement])
def read_announcements(
    department: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    announcements = crud.get_announcements(db, skip=skip, limit=limit, department=department)
    return announcements

# ChatGroup endpoints
@app.post("/chat-groups/", response_model=schemas.ChatGroup)
def create_chat_group(chat_group: schemas.ChatGroupCreate, db: Session = Depends(get_db)):
    return crud.create_chat_group(db=db, chat_group=chat_group)

@app.get("/chat-groups/teacher/{teacher_id}", response_model=List[schemas.ChatGroup])
def read_teacher_chat_groups(teacher_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    chat_groups = crud.get_chat_groups_for_teacher(db, teacher_id=teacher_id, skip=skip, limit=limit)
    return chat_groups

@app.get("/chat-groups/student/{student_id}", response_model=List[schemas.ChatGroup])
def read_student_chat_groups(student_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    student = crud.get_user(db, user_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    chat_groups = crud.get_chat_groups_for_student(db, student_id=student_id, semester=student.semester, skip=skip, limit=limit)
    return chat_groups

@app.get("/chat-groups/{chat_group_id}", response_model=schemas.ChatGroup)
def read_chat_group(chat_group_id: str, db: Session = Depends(get_db)):
    db_chat_group = crud.get_chat_group(db, chat_group_id=chat_group_id)
    if db_chat_group is None:
        raise HTTPException(status_code=404, detail="Chat group not found")
    return db_chat_group

# Message endpoints
@app.post("/messages/", response_model=schemas.Message)
def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    return crud.create_message(db=db, message=message)

@app.get("/messages/{chat_group_id}", response_model=List[schemas.Message])
def read_messages(chat_group_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    messages = crud.get_messages(db, chat_group_id=chat_group_id, skip=skip, limit=limit)
    return messages
