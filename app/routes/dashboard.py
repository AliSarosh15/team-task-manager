from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.models import Task
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    tasks = db.query(Task).all()

    # ✅ Group tasks by status
    pending_tasks = []
    in_progress_tasks = []
    completed_tasks = []
    overdue_tasks = []

    for task in tasks:
        task_data = {
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "deadline": task.deadline,
            "assigned_to": task.assigned_to
        }

        # Status grouping
        if task.status == "pending":
            pending_tasks.append(task_data)
        elif task.status == "in_progress":
            in_progress_tasks.append(task_data)
        elif task.status == "completed":
            completed_tasks.append(task_data)

        # Overdue logic
        if (
            task.deadline
            and task.deadline < date.today()
            and task.status != "completed"
        ):
            overdue_tasks.append(task_data)

    return {
        "tasks_by_status": {
            "pending": pending_tasks,
            "in_progress": in_progress_tasks,
            "completed": completed_tasks
        },
        "overdue_tasks": overdue_tasks,
        "summary": {
            "total": len(tasks),
            "pending": len(pending_tasks),
            "in_progress": len(in_progress_tasks),
            "completed": len(completed_tasks),
            "overdue": len(overdue_tasks)
        }
    }