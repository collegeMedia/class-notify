from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: str
    department: str
    avatar: Optional[str] = None
    semester: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

# Announcement schemas
class AnnouncementBase(BaseModel):
    title: str
    content: str
    department: Optional[str] = None
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

# ChatGroup schemas
class ChatGroupBase(BaseModel):
    name: str
    subject_id: str
    semester: str

class ChatGroupCreate(ChatGroupBase):
    teacher_id: str

class ChatGroup(ChatGroupBase):
    id: str
    created_at: datetime
    teacher: User

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
