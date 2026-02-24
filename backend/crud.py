from sqlalchemy.orm import Session
from sqlalchemy import and_
import models, schemas
import json
from typing import Optional, List
from auth import get_password_hash, verify_password

# Authentication operations
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Department operations
def get_department(db: Session, department_id: str):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_department_by_code(db: Session, code: str):
    return db.query(models.Department).filter(models.Department.code == code).first()

def get_department_by_name(db: Session, name: str):
    return db.query(models.Department).filter(models.Department.name == name).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.Department(
        name=department.name,
        code=department.code,
        description=department.description
    )
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

# User operations
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        department=user.department,
        department_id=user.department_id,
        avatar=user.avatar,
        semester=user.semester
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Assignment operations
def get_assignment(db: Session, assignment_id: str):
    return db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()

def get_assignments(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    department: Optional[str] = None,
    semester: Optional[str] = None
):
    query = db.query(models.Assignment)
    
    if department:
        query = query.filter(models.Assignment.department == department)
    
    if semester:
        query = query.filter(models.Assignment.semester == semester)
        
    return query.offset(skip).limit(limit).all()

def create_assignment(db: Session, assignment: schemas.AssignmentCreate):
    db_assignment = models.Assignment(
        title=assignment.title,
        description=assignment.description,
        due_date=assignment.due_date,
        department=assignment.department,
        department_id=assignment.department_id,
        subject=assignment.subject,
        author_id=assignment.author_id,
        attachments=assignment.attachments,
        semester=assignment.semester
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def update_assignment(db: Session, assignment_id: str, assignment: schemas.AssignmentCreate):
    db_assignment = get_assignment(db, assignment_id)
    if not db_assignment:
        return None
    
    db_assignment.title = assignment.title
    db_assignment.description = assignment.description
    db_assignment.due_date = assignment.due_date
    db_assignment.department = assignment.department
    db_assignment.department_id = assignment.department_id
    db_assignment.subject = assignment.subject
    db_assignment.attachments = assignment.attachments
    db_assignment.semester = assignment.semester
    
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def delete_assignment(db: Session, assignment_id: str):
    db_assignment = get_assignment(db, assignment_id)
    if not db_assignment:
        return False
    
    db.delete(db_assignment)
    db.commit()
    return True

# Lecture operations
def get_lecture(db: Session, lecture_id: str):
    return db.query(models.Lecture).filter(models.Lecture.id == lecture_id).first()

def get_lectures(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    department: Optional[str] = None,
    semester: Optional[str] = None,
    date: Optional[str] = None
):
    query = db.query(models.Lecture)
    
    if department:
        query = query.filter(models.Lecture.department == department)
    
    if semester:
        query = query.filter(models.Lecture.semester == semester)
        
    if date:
        query = query.filter(models.Lecture.date == date)
        
    return query.offset(skip).limit(limit).all()

def create_lecture(db: Session, lecture: schemas.LectureCreate):
    db_lecture = models.Lecture(
        title=lecture.title,
        description=lecture.description,
        date=lecture.date,
        start_time=lecture.start_time,
        end_time=lecture.end_time,
        location=lecture.location,
        department=lecture.department,
        department_id=lecture.department_id,
        subject=lecture.subject,
        professor_id=lecture.professor_id,
        materials=lecture.materials,
        semester=lecture.semester
    )
    db.add(db_lecture)
    db.commit()
    db.refresh(db_lecture)
    return db_lecture

def update_lecture(db: Session, lecture_id: str, lecture: schemas.LectureCreate):
    db_lecture = get_lecture(db, lecture_id)
    if not db_lecture:
        return None
    
    db_lecture.title = lecture.title
    db_lecture.description = lecture.description
    db_lecture.date = lecture.date
    db_lecture.start_time = lecture.start_time
    db_lecture.end_time = lecture.end_time
    db_lecture.location = lecture.location
    db_lecture.department = lecture.department
    db_lecture.department_id = lecture.department_id
    db_lecture.subject = lecture.subject
    db_lecture.professor_id = lecture.professor_id
    db_lecture.materials = lecture.materials
    db_lecture.semester = lecture.semester
    
    db.commit()
    db.refresh(db_lecture)
    return db_lecture

def delete_lecture(db: Session, lecture_id: str):
    db_lecture = get_lecture(db, lecture_id)
    if not db_lecture:
        return False
    
    db.delete(db_lecture)
    db.commit()
    return True

# Subject operations
def get_subject(db: Session, subject_id: str):
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()

def get_subject_by_code(db: Session, code: str):
    return db.query(models.Subject).filter(models.Subject.code == code).first()

def get_subject_by_name(db: Session, name: str):
    return db.query(models.Subject).filter(models.Subject.name == name).first()

def is_professor_of_subject(db: Session, user_id: str, subject_code_or_name: str) -> bool:
    subject = get_subject_by_code(db, subject_code_or_name)
    if not subject:
        subject = get_subject_by_name(db, subject_code_or_name)
    
    if not subject:
        return False
    
    return subject.professor_id == user_id

def get_subjects(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    department: Optional[str] = None,
    semester: Optional[str] = None
):
    query = db.query(models.Subject)
    
    if department:
        query = query.filter(models.Subject.department == department)
    
    if semester:
        query = query.filter(models.Subject.semester == semester)
        
    return query.offset(skip).limit(limit).all()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(
        name=subject.name,
        code=subject.code,
        department=subject.department,
        department_id=subject.department_id,
        professor_id=subject.professor_id,
        description=subject.description,
        semester=subject.semester,
        credits=subject.credits,
        prerequisites=subject.prerequisites
    )
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

# Announcement operations
def get_announcement(db: Session, announcement_id: str):
    return db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()

def get_announcements(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    department: Optional[str] = None
):
    query = db.query(models.Announcement)
    
    if department:
        # Get announcements for the specific department or global announcements
        query = query.filter(
            (models.Announcement.department == department) | 
            (models.Announcement.department == None)
        )
        
    return query.offset(skip).limit(limit).all()

def create_announcement(db: Session, announcement: schemas.AnnouncementCreate):
    db_announcement = models.Announcement(
        title=announcement.title,
        content=announcement.content,
        author_id=announcement.author_id,
        department=announcement.department,
        department_id=announcement.department_id,
        important=announcement.important,
        semester=announcement.semester
    )
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

# Subject Enrollment operations
def enroll_student_in_subject(db: Session, student_id: str, subject_id: str):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    
    if not student or not subject:
        return None
    
    if student.role != "student":
        return None
    
    if subject not in student.enrolled_subjects:
        student.enrolled_subjects.append(subject)
        db.commit()
        db.refresh(student)
    
    return subject

def unenroll_student_from_subject(db: Session, student_id: str, subject_id: str):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    
    if not student or not subject:
        return False
    
    if subject in student.enrolled_subjects:
        student.enrolled_subjects.remove(subject)
        db.commit()
    
    return True

def get_enrolled_students(db: Session, subject_id: str):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        return []
    return subject.enrolled_students

def get_student_subjects(db: Session, student_id: str):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        return []
    return student.enrolled_subjects

# ChatGroup operations
def get_chat_group(db: Session, chat_group_id: str):
    return db.query(models.ChatGroup).filter(models.ChatGroup.id == chat_group_id).first()

def get_chat_group_by_subject(db: Session, subject_id: str):
    return db.query(models.ChatGroup).filter(models.ChatGroup.subject_id == subject_id).first()

def get_chat_groups_for_teacher(db: Session, teacher_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.ChatGroup).filter(
        models.ChatGroup.teacher_id == teacher_id,
        models.ChatGroup.is_active == True
    ).offset(skip).limit(limit).all()

def get_chat_groups_for_student(db: Session, student_id: str, skip: int = 0, limit: int = 100):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    
    if not student or student.role != "student":
        return []
    
    return student.joined_chat_groups

def create_chat_group(db: Session, chat_group: schemas.ChatGroupCreate):
    subject = db.query(models.Subject).filter(models.Subject.id == chat_group.subject_id).first()
    
    if not subject:
        return None
    
    existing_group = get_chat_group_by_subject(db, chat_group.subject_id)
    if existing_group:
        return existing_group
    
    teacher_id = chat_group.teacher_id or subject.professor_id
    
    db_chat_group = models.ChatGroup(
        name=chat_group.name,
        subject_id=chat_group.subject_id,
        teacher_id=teacher_id,
        semester=chat_group.semester
    )
    db.add(db_chat_group)
    db.commit()
    db.refresh(db_chat_group)
    
    enrolled_students = get_enrolled_students(db, chat_group.subject_id)
    for student in enrolled_students:
        add_member_to_chat_group(db, db_chat_group.id, student.id)
    
    return db_chat_group

def add_member_to_chat_group(db: Session, chat_group_id: str, user_id: str):
    chat_group = db.query(models.ChatGroup).filter(models.ChatGroup.id == chat_group_id).first()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not chat_group or not user:
        return None
    
    subject = chat_group.subject
    if user.role == "student" and subject not in user.enrolled_subjects:
        return None
    
    if user not in chat_group.members:
        chat_group.members.append(user)
        db.commit()
        db.refresh(chat_group)
    
    return chat_group

def remove_member_from_chat_group(db: Session, chat_group_id: str, user_id: str):
    chat_group = db.query(models.ChatGroup).filter(models.ChatGroup.id == chat_group_id).first()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not chat_group or not user:
        return False
    
    if user in chat_group.members:
        chat_group.members.remove(user)
        db.commit()
    
    return True

def is_member_of_chat_group(db: Session, chat_group_id: str, user_id: str) -> bool:
    chat_group = db.query(models.ChatGroup).filter(models.ChatGroup.id == chat_group_id).first()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not chat_group or not user:
        return False
    
    if user.id == chat_group.teacher_id:
        return True
    
    return user in chat_group.members

# Message operations
def get_messages(db: Session, chat_group_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Message).filter(
        models.Message.chat_group_id == chat_group_id
    ).order_by(models.Message.created_at).offset(skip).limit(limit).all()

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(
        content=message.content,
        sender_id=message.sender_id,
        chat_group_id=message.chat_group_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
