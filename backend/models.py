from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
import datetime
import uuid
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="department_rel")
    announcements = relationship("Announcement", back_populates="department_rel")
    assignments = relationship("Assignment", back_populates="department_rel")
    lectures = relationship("Lecture", back_populates="department_rel")
    subjects = relationship("Subject", back_populates="department_rel")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)
    department = Column(String)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    avatar = Column(String, nullable=True)
    semester = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    department_rel = relationship("Department", back_populates="users")
    announcements = relationship("Announcement", back_populates="author")
    assignments = relationship("Assignment", back_populates="author")
    lectures = relationship("Lecture", back_populates="professor")
    subjects = relationship("Subject", back_populates="professor")
    messages = relationship("Message", back_populates="sender")
    chat_groups = relationship("ChatGroup", back_populates="teacher")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    author_id = Column(String, ForeignKey("users.id"))
    department = Column(String, nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    important = Column(Boolean, default=False)
    semester = Column(String, nullable=True)

    # Relationships
    author = relationship("User", back_populates="announcements")
    department_rel = relationship("Department", back_populates="announcements")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(Text)
    due_date = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    department = Column(String)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    subject = Column(String)
    author_id = Column(String, ForeignKey("users.id"))
    attachments = Column(String, nullable=True)  # JSON string of file paths
    semester = Column(String)

    # Relationships
    author = relationship("User", back_populates="assignments")
    department_rel = relationship("Department", back_populates="assignments")

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(Text)
    date = Column(String)
    start_time = Column(String)
    end_time = Column(String)
    location = Column(String)
    department = Column(String)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    subject = Column(String)
    professor_id = Column(String, ForeignKey("users.id"))
    materials = Column(String, nullable=True)  # JSON string of file paths
    semester = Column(String)

    # Relationships
    professor = relationship("User", back_populates="lectures")
    department_rel = relationship("Department", back_populates="lectures")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    code = Column(String, unique=True)
    department = Column(String)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    professor_id = Column(String, ForeignKey("users.id"))
    description = Column(Text)
    semester = Column(String)
    credits = Column(Integer, nullable=True)
    prerequisites = Column(String, nullable=True)  # JSON string of subject codes

    # Relationships
    professor = relationship("User", back_populates="subjects")
    department_rel = relationship("Department", back_populates="subjects")

class ChatGroup(Base):
    __tablename__ = "chat_groups"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    subject_id = Column(String, ForeignKey("subjects.id"))
    teacher_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    semester = Column(String)
    
    # Relationships
    teacher = relationship("User", back_populates="chat_groups")
    messages = relationship("Message", back_populates="chat_group")
    
class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    sender_id = Column(String, ForeignKey("users.id"))
    chat_group_id = Column(String, ForeignKey("chat_groups.id"))
    
    # Relationships
    sender = relationship("User", back_populates="messages")
    chat_group = relationship("ChatGroup", back_populates="messages")
