from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app.models import User
from app.schemas import UserCreate
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ SIGNUP
@router.post("/signup")
def signup(data: UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.username == data.username).first()

    if user_exists:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(
        username=data.username,
        password=hash_password(data.password),
        role=data.role
    )

    db.add(user)
    db.commit()

    return {"message": "User created successfully"}


# ✅ LOGIN (🔥 THIS FIXES YOUR 422 ERROR)
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),   # ✅ IMPORTANT
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }