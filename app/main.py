from fastapi import FastAPI
from .database import engine, Base
from .routes import user, project, task, dashboard

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(project.router, prefix="/projects", tags=["Projects"])
app.include_router(task.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])