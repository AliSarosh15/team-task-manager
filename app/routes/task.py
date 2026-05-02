from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..models import Task, User, Project
from ..schemas import TaskCreate, TaskUpdate
from ..database import get_db
from ..dependencies import get_current_user, admin_required

router = APIRouter()

@router.get("/users/")
def get_users(db: Session = Depends(get_db), user=Depends(admin_required)):
    return db.query(User).all()

@router.post("/")
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):
    # ✅ Validate project
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=400, detail="Project not found")

    # ✅ Validate user
    assigned_user = db.query(User).filter(User.id == data.assigned_to).first()
    if not assigned_user:
        raise HTTPException(status_code=400, detail="User not found")

    task = Task(
        title=data.title,
        description=data.description,
        project_id=data.project_id,
        assigned_to=data.assigned_to,
        deadline=data.deadline
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {"message": "Task created", "task_id": task.id}


@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Task).all()


@router.put("/{task_id}")
def update_task_status(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if user["role"] != "admin" and task.assigned_to != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    valid_status = ["pending", "in_progress", "completed"]

    if data.status not in valid_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    task.status = data.status

    if data.status == "completed":
        task.completed_at = datetime.utcnow()
    else:
        task.completed_at = None

    db.commit()

    return {"message": "Task updated"}


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}


@router.get("/project/{project_id}")
def get_tasks_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Task).filter(Task.project_id == project_id).all()