from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# Department schemas
class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: str
    department: str
    department_id: Optional[str] = None
    avatar: Optional[str] = None
    semester: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Announcement schemas
class AnnouncementBase(BaseModel):
    title: str
    content: str
    department: Optional[str] = None
    department_id: Optional[str] = None
    important: bool = False
    semester: Optional[str] = None

class AnnouncementCreate(AnnouncementBase):
    author_id: str

class Announcement(AnnouncementBase):
    id: str
    created_at: datetime
    author: User

    class Config:
        orm_mode = True

# Assignment schemas
class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: str
    department: str
    department_id: Optional[str] = None
    subject: str
    attachments: Optional[str] = None
    semester: str

class AssignmentCreate(AssignmentBase):
    author_id: str

class Assignment(AssignmentBase):
    id: str
    created_at: datetime
    author: User

    class Config:
        orm_mode = True

# Lecture schemas
class LectureBase(BaseModel):
    title: str
    description: str
    date: str
    start_time: str
    end_time: str
    location: str
    department: str
    department_id: Optional[str] = None
    subject: str
    materials: Optional[str] = None
    semester: str

class LectureCreate(LectureBase):
    professor_id: str

class Lecture(LectureBase):
    id: str
    professor: User

    class Config:
        orm_mode = True

# Subject schemas
class SubjectBase(BaseModel):
    name: str
    code: str
    department: str
    department_id: Optional[str] = None
    description: str
    semester: str
    credits: Optional[int] = None
    prerequisites: Optional[str] = None

class SubjectCreate(SubjectBase):
    professor_id: str

class Subject(SubjectBase):
    id: str
    professor: User

    class Config:
        orm_mode = True

# Subject Enrollment schemas
class SubjectEnrollmentCreate(BaseModel):
    student_id: str
    subject_id: str

class SubjectEnrollment(BaseModel):
    student_id: str
    subject_id: str
    enrolled_at: datetime

    class Config:
        orm_mode = True

# ChatGroup schemas
class ChatGroupBase(BaseModel):
    name: str
    subject_id: str
    semester: str

class ChatGroupCreate(ChatGroupBase):
    teacher_id: Optional[str] = None

class ChatGroup(ChatGroupBase):
    id: str
    created_at: datetime
    is_active: bool
    teacher: User

    class Config:
        orm_mode = True

class ChatGroupWithMembers(ChatGroup):
    members: List[User]

    class Config:
        orm_mode = True

# Message schemas
class MessageBase(BaseModel):
    content: str
    chat_group_id: str

class MessageCreate(MessageBase):
    sender_id: str

class Message(MessageBase):
    id: str
    created_at: datetime
    sender: User

    class Config:
        orm_mode = True
