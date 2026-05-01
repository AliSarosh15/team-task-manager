from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import Project
from ..schemas import ProjectCreate
from ..database import get_db
from ..dependencies import admin_required, get_current_user

router = APIRouter()


@router.post("/")
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):
    project = Project(
        project_name=data.project_name,
        deadline=data.deadline,
        created_by=user["user_id"]
    )

    db.add(project)
    db.commit()

    return {"message": "Project created"}


@router.get("/")
def get_projects(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Project).all()