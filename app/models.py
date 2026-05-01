from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="member")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    project_name = Column(String)
    deadline = Column(Date)
    created_by = Column(Integer, ForeignKey("users.id"))


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    status = Column(String, default="pending")

    deadline = Column(Date)
    completed_at = Column(DateTime, nullable=True)

    project_id = Column(Integer, ForeignKey("projects.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"))