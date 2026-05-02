from fastapi import FastAPI
from .database import engine, Base
from .routes import user, project, task, dashboard
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
@app.get("/")
def home():
    return {"message": "Team Task Manager API is live 🚀"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # local frontend
        "https://team-task-manager-ele06isaf-alisarosh15s-projects.vercel.app",  # your deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(project.router, prefix="/projects", tags=["Projects"])
app.include_router(task.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

