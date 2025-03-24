from sqlalchemy.orm import Session
from sqlalchemy import and_
import models, schemas
import json
from typing import Optional, List

# User operations
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role,
        department=user.department,
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
        subject=assignment.subject,
        author_id=assignment.author_id,
        attachments=assignment.attachments,
        semester=assignment.semester
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

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
        subject=lecture.subject,
        professor_id=lecture.professor_id,
        materials=lecture.materials,
        semester=lecture.semester
    )
    db.add(db_lecture)
    db.commit()
    db.refresh(db_lecture)
    return db_lecture

# Subject operations
def get_subject(db: Session, subject_id: str):
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()

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
        important=announcement.important,
        semester=announcement.semester
    )
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

# ChatGroup operations
def get_chat_group(db: Session, chat_group_id: str):
    return db.query(models.ChatGroup).filter(models.ChatGroup.id == chat_group_id).first()

def get_chat_groups_for_teacher(db: Session, teacher_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.ChatGroup).filter(models.ChatGroup.teacher_id == teacher_id).offset(skip).limit(limit).all()

def get_chat_groups_for_student(db: Session, student_id: str, semester: str, skip: int = 0, limit: int = 100):
    # Logic: Find subjects that this student should be part of based on their department and semester
    student = db.query(models.User).filter(models.User.id == student_id).first()
    
    if not student:
        return []
    
    # Find chat groups for subjects in the student's department and semester
    return db.query(models.ChatGroup).join(
        models.Subject, models.ChatGroup.subject_id == models.Subject.id
    ).filter(
        models.Subject.department == student.department,
        models.ChatGroup.semester == student.semester
    ).offset(skip).limit(limit).all()

def create_chat_group(db: Session, chat_group: schemas.ChatGroupCreate):
    db_chat_group = models.ChatGroup(
        name=chat_group.name,
        subject_id=chat_group.subject_id,
        teacher_id=chat_group.teacher_id,
        semester=chat_group.semester
    )
    db.add(db_chat_group)
    db.commit()
    db.refresh(db_chat_group)
    return db_chat_group

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
