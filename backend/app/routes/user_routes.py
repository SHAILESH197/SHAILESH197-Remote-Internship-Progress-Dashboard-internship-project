from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.utils.hash import hash_password, verify_password
from app.utils.token import create_access_token, verify_access_token

from app.models.database import get_db
from app.models.user_model import User
from app.schemas.user__schema import UserCreate

router = APIRouter(prefix="/users", tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="student"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "role": new_user.role
    }


@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/profile")
def get_profile(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "message": "Profile accessed successfully",
        "user_email": payload.get("sub"),
        "role": payload.get("role")
    }


@router.get("/admin")
def admin_dashboard(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Admin only")

    return {
        "message": "Welcome Admin 🚀"
    }


@router.get("/tasks")
def get_tasks(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    role = payload.get("role")

    if role == "admin":
        tasks = [
            {"title": "Review student weekly reports", "status": "Pending"},
            {"title": "Assign dashboard module task", "status": "In Progress"},
            {"title": "Verify authentication module", "status": "Completed"},
            {"title": "Provide mentor feedback", "status": "Pending"}
        ]
    else:
        tasks = [
            {"title": "Complete login module", "status": "Completed"},
            {"title": "Submit weekly progress report", "status": "In Progress"},
            {"title": "Work on dashboard UI", "status": "Pending"}
        ]

    return {
        "user_email": payload.get("sub"),
        "role": role,
        "tasks": tasks
    }