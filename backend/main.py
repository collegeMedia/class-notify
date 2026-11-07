from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
import models, schemas, crud
from database import get_db
from auth import (
    create_access_token, 
    get_current_user, 
    get_current_admin_user, 
    get_current_staff_user,
    is_staff,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Schema is managed by Alembic: run `alembic upgrade head` before starting the app.
app =FastAPI(title="University Management API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def require_subject_teacher_or_admin(db: Session, current_user: models.User, subject_id: str) -> models.Subject:
    """Allow admins, or the teacher assigned to this subject. Raises 404/403 otherwise."""
    subject = crud.get_subject(db, subject_id=subject_id)
    if subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    if current_user.role == "admin":
        return subject
    if current_user.role not in ["professor", "teacher"] or subject.professor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only manage subjects you teach")
    return subject

@app.get("/")
def read_root():
    return {"message": "University Management API is running"}

# Auth endpoints
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # Self-registration always creates a student; staff accounts are created by admins via POST /users/.
    user = user.model_copy(update={"role": "student"})
    return crud.create_user(db=db, user=user)

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Department endpoints (Admin only for creating)
@app.post("/departments/", response_model=schemas.Department)
def create_department(
    department: schemas.DepartmentCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_department = crud.get_department_by_code(db, code=department.code)
    if db_department:
        raise HTTPException(status_code=400, detail="Department code already exists")
    db_department = crud.get_department_by_name(db, name=department.name)
    if db_department:
        raise HTTPException(status_code=400, detail="Department name already exists")
    return crud.create_department(db=db, department=department)

@app.get("/departments/", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    departments = crud.get_departments(db, skip=skip, limit=limit)
    return departments

@app.get("/departments/code/{code}", response_model=schemas.Department)
def read_department_by_code(code: str, db: Session = Depends(get_db)):
    db_department = crud.get_department_by_code(db, code=code)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@app.get("/departments/{department_id}", response_model=schemas.Department)
def read_department(department_id: str, db: Session = Depends(get_db)):
    db_department = crud.get_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

# User endpoints (Admin only for creating)
@app.post("/users/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_staff_user)
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id and not is_staff(current_user):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- Assignment / lecture permission helpers ---
TEACHER_ROLES = ["professor", "teacher"]

def resolve_subject_or_400(db: Session, subject_id: Optional[str], subject_ref: Optional[str]) -> models.Subject:
    try:
        return crud.resolve_subject(db, subject_id=subject_id, subject_ref=subject_ref)
    except crud.SubjectLookupError as e:
        raise HTTPException(status_code=400, detail=str(e))

def require_teacher_role(current_user: models.User, kind: str, action: str):
    if current_user.role not in TEACHER_ROLES:
        raise HTTPException(status_code=403, detail=f"Only professors and admins can {action} {kind}")

def require_teaches(db: Session, current_user: models.User, subject: Optional[models.Subject], kind: str, action: str):
    if not crud.is_professor_of_subject(db, current_user.id, subject):
        raise HTTPException(status_code=403, detail=f"You can only {action} {kind} for subjects you teach")

# Assignment endpoints
@app.post("/assignments/", response_model=schemas.Assignment)
def create_assignment(
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = resolve_subject_or_400(db, assignment.subject_id, assignment.subject)
    if current_user.role == "admin":
        return crud.create_assignment(db, assignment, subject, author_id=assignment.author_id or current_user.id)

    require_teacher_role(current_user, "assignments", "create")
    require_teaches(db, current_user, subject, "assignments", "create")
    return crud.create_assignment(db, assignment, subject, author_id=current_user.id)

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

@app.put("/assignments/{assignment_id}", response_model=schemas.Assignment)
def update_assignment(
    assignment_id: str,
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_assignment = crud.get_assignment(db, assignment_id)
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    new_subject = resolve_subject_or_400(db, assignment.subject_id, assignment.subject)
    if current_user.role == "admin":
        return crud.update_assignment(db, assignment_id, assignment, new_subject,
                                      author_id=assignment.author_id or db_assignment.author_id)

    require_teacher_role(current_user, "assignments", "update")
    if db_assignment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update assignments you created")
    # Must still teach the current subject, and the subject it is being moved to.
    require_teaches(db, current_user, crud.subject_of_item(db, db_assignment), "assignments", "update")
    require_teaches(db, current_user, new_subject, "assignments", "update")
    return crud.update_assignment(db, assignment_id, assignment, new_subject, author_id=current_user.id)

@app.delete("/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_assignment = crud.get_assignment(db, assignment_id)
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if current_user.role != "admin":
        require_teacher_role(current_user, "assignments", "delete")
        if db_assignment.author_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only delete assignments you created")
        require_teaches(db, current_user, crud.subject_of_item(db, db_assignment), "assignments", "delete")

    if crud.delete_assignment(db, assignment_id):
        return {"message": "Assignment deleted successfully"}
    raise HTTPException(status_code=500, detail="Failed to delete assignment")

# Lecture endpoints
@app.post("/lectures/", response_model=schemas.Lecture)
def create_lecture(
    lecture: schemas.LectureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = resolve_subject_or_400(db, lecture.subject_id, lecture.subject)
    if current_user.role == "admin":
        professor_id = lecture.professor_id or subject.professor_id or current_user.id
        return crud.create_lecture(db, lecture, subject, professor_id=professor_id)

    require_teacher_role(current_user, "lectures", "create")
    require_teaches(db, current_user, subject, "lectures", "create")
    return crud.create_lecture(db, lecture, subject, professor_id=current_user.id)

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

@app.get("/lectures/{lecture_id}", response_model=schemas.Lecture)
def read_lecture(lecture_id: str, db: Session = Depends(get_db)):
    db_lecture = crud.get_lecture(db, lecture_id=lecture_id)
    if db_lecture is None:
        raise HTTPException(status_code=404, detail="Lecture not found")
    return db_lecture

@app.put("/lectures/{lecture_id}", response_model=schemas.Lecture)
def update_lecture(
    lecture_id: str,
    lecture: schemas.LectureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_lecture = crud.get_lecture(db, lecture_id)
    if not db_lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")

    new_subject = resolve_subject_or_400(db, lecture.subject_id, lecture.subject)
    if current_user.role == "admin":
        return crud.update_lecture(db, lecture_id, lecture, new_subject,
                                   professor_id=lecture.professor_id or db_lecture.professor_id)

    require_teacher_role(current_user, "lectures", "update")
    if db_lecture.professor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update lectures you created")
    # Must still teach the current subject, and the subject it is being moved to.
    require_teaches(db, current_user, crud.subject_of_item(db, db_lecture), "lectures", "update")
    require_teaches(db, current_user, new_subject, "lectures", "update")
    return crud.update_lecture(db, lecture_id, lecture, new_subject, professor_id=current_user.id)

@app.delete("/lectures/{lecture_id}")
def delete_lecture(
    lecture_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_lecture = crud.get_lecture(db, lecture_id)
    if not db_lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")

    if current_user.role != "admin":
        require_teacher_role(current_user, "lectures", "delete")
        if db_lecture.professor_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only delete lectures you created")
        require_teaches(db, current_user, crud.subject_of_item(db, db_lecture), "lectures", "delete")

    if crud.delete_lecture(db, lecture_id):
        return {"message": "Lecture deleted successfully"}
    raise HTTPException(status_code=500, detail="Failed to delete lecture")

# Subject endpoints
@app.post("/subjects/", response_model=schemas.Subject)
def create_subject(
    subject: schemas.SubjectCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
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

@app.get("/subjects/{subject_id}", response_model=schemas.Subject)
def read_subject(subject_id: str, db: Session = Depends(get_db)):
    subject = crud.get_subject(db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@app.get("/subjects/professor/{professor_id}", response_model=List[schemas.Subject])
def read_professor_subjects(
    professor_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != professor_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    subjects = db.query(models.Subject).filter(models.Subject.professor_id == professor_id).all()
    return subjects

# Subject Enrollment endpoints
@app.post("/subjects/{subject_id}/enroll/{student_id}")
def enroll_student(
    subject_id: str, 
    student_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_subject_teacher_or_admin(db, current_user, subject_id)
    
    result = crud.enroll_student_in_subject(db, student_id, subject_id)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to enroll student")
    
    return {"message": "Student enrolled successfully"}

@app.delete("/subjects/{subject_id}/enroll/{student_id}")
def unenroll_student(
    subject_id: str, 
    student_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_subject_teacher_or_admin(db, current_user, subject_id)
    
    result = crud.unenroll_student_from_subject(db, student_id, subject_id)
    if not result:
        raise HTTPException(status_code=404, detail="Student or subject not found")
    
    return {"message": "Student unenrolled successfully"}

@app.get("/subjects/{subject_id}/students", response_model=List[schemas.User])
def read_enrolled_students(
    subject_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not is_staff(current_user):
        subject = crud.get_subject(db, subject_id=subject_id)
        if not subject or subject not in current_user.enrolled_subjects:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    students = crud.get_enrolled_students(db, subject_id)
    return students

@app.get("/students/{student_id}/subjects", response_model=List[schemas.Subject])
def read_student_subjects(
    student_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != student_id and not is_staff(current_user):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    subjects = crud.get_student_subjects(db, student_id)
    return subjects

# Announcement endpoints
@app.post("/announcements/", response_model=schemas.Announcement)
def create_announcement(
    announcement: schemas.AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_staff_user)
):
    return crud.create_announcement(db=db, announcement=announcement, author_id=current_user.id)

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
def create_chat_group(
    chat_group: schemas.ChatGroupCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    require_subject_teacher_or_admin(db, current_user, chat_group.subject_id)
    if current_user.role != "admin":
        # Teachers always own the groups they create; only admins may assign another teacher.
        chat_group = chat_group.model_copy(update={"teacher_id": current_user.id})
    
    result = crud.create_chat_group(db=db, chat_group=chat_group)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to create chat group. Subject may not exist.")
    
    return result

@app.get("/chat-groups/teacher/{teacher_id}", response_model=List[schemas.ChatGroup])
def read_teacher_chat_groups(
    teacher_id: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != teacher_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    chat_groups = crud.get_chat_groups_for_teacher(db, teacher_id=teacher_id, skip=skip, limit=limit)
    return chat_groups

@app.get("/chat-groups/student/{student_id}", response_model=List[schemas.ChatGroup])
def read_student_chat_groups(
    student_id: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    chat_groups = crud.get_chat_groups_for_student(db, student_id=student_id, skip=skip, limit=limit)
    return chat_groups

@app.get("/chat-groups/{chat_group_id}", response_model=schemas.ChatGroupWithMembers)
def read_chat_group(
    chat_group_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_chat_group = crud.get_chat_group(db, chat_group_id=chat_group_id)
    if db_chat_group is None:
        raise HTTPException(status_code=404, detail="Chat group not found")
    
    if not crud.is_member_of_chat_group(db, chat_group_id, current_user.id):
        raise HTTPException(status_code=403, detail="You are not a member of this chat group")
    
    return db_chat_group

@app.post("/chat-groups/{chat_group_id}/members/{user_id}")
def add_chat_group_member(
    chat_group_id: str, 
    user_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chat_group = crud.get_chat_group(db, chat_group_id)
    if not chat_group:
        raise HTTPException(status_code=404, detail="Chat group not found")
    
    if current_user.id != chat_group.teacher_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the teacher or admin can add members")
    
    result = crud.add_member_to_chat_group(db, chat_group_id, user_id)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to add member. User may not be enrolled in the subject.")
    
    return {"message": "Member added successfully"}

@app.delete("/chat-groups/{chat_group_id}/members/{user_id}")
def remove_chat_group_member(
    chat_group_id: str, 
    user_id: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chat_group = crud.get_chat_group(db, chat_group_id)
    if not chat_group:
        raise HTTPException(status_code=404, detail="Chat group not found")
    
    if current_user.id != chat_group.teacher_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the teacher or admin can remove members")
    
    result = crud.remove_member_from_chat_group(db, chat_group_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User or chat group not found")
    
    return {"message": "Member removed successfully"}

# Message endpoints
@app.post("/messages/", response_model=schemas.Message)
def create_message(
    message: schemas.MessageCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not crud.is_member_of_chat_group(db, message.chat_group_id, current_user.id):
        raise HTTPException(status_code=403, detail="You must be a member of this chat group to send messages")
    
    return crud.create_message(db=db, message=message, sender_id=current_user.id)

@app.get("/messages/{chat_group_id}", response_model=List[schemas.Message])
def read_messages(
    chat_group_id: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not crud.is_member_of_chat_group(db, chat_group_id, current_user.id):
        raise HTTPException(status_code=403, detail="You must be a member of this chat group to view messages")
    
    messages = crud.get_messages(db, chat_group_id=chat_group_id, skip=skip, limit=limit)
    return messages
