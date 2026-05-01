from pydantic import BaseModel, EmailStr
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "member"


class LoginSchema(BaseModel):
    username: str
    password: str


class ProjectCreate(BaseModel):
    project_name: str
    deadline: date


class TaskCreate(BaseModel):
    title: str
    description: str
    project_id: int
    assigned_to: int
    deadline: date


class TaskUpdate(BaseModel):
    status: str