from fastapi import APIRouter, FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from models.models import User, user_likes_subject, Subject, Topic
from db_setup import get_db, init_db
from schemas.schemas import SubjectLikeRequest, SubjectResponse, UserBase, UserCreate, SubjectLikeRequest
from security import get_current_user
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from openai import OpenAI
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)
load_dotenv()

client = OpenAI()
user_router = APIRouter(tags=["User"])


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")


@user_router.post("/users/{user_id}/update-profile", status_code=200)
async def update_user_profile(
    user_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update user profile information including first name, last name, and email.
    """

    # Ensure the user is updating their own profile
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403, detail="You are not authorized to update this profile")

    # Fetch the user from the database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user fields
    user.first_name = first_name
    user.last_name = last_name
    user.email = email

    db.commit()

    return {
        "message": "Profile updated successfully",
        "user": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
    }


@user_router.post("/users/{user_id}/add-subject", response_model=SubjectResponse)
async def add_new_subject(user_id: int, request: SubjectLikeRequest, db: Session = Depends(get_db)):
    """
    Add a new subject to the user's liked subjects.
    """
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if subject exists, otherwise create it
    subject = db.query(Subject).filter(
        Subject.name == request.subject_name).first()
    if not subject:
        subject = Subject(name=request.subject_name)
        db.add(subject)
        db.commit()
        db.refresh(subject)

    # Append the subject to user's liked subjects if not already liked
    if subject not in user.liked_subjects:
        user.liked_subjects.append(subject)
        db.commit()

    return SubjectResponse(id=subject.id, name=subject.name)

# Endpoint 1: Delete a subject liked by a user


@user_router.delete("/users/{user_id}/subjects/{subject_id}", status_code=200, tags=["Subjects"])
async def delete_subject(user_id: int, subject_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the subject exists
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Check if the subject is in the user's liked subjects
    if subject not in user.liked_subjects:
        raise HTTPException(
            status_code=404, detail="Subject not found in user's liked subjects")

    # Remove the subject from the user's liked subjects
    user.liked_subjects.remove(subject)
    db.commit()

    return {"message": f"Deleted subject: {subject.name} from user's liked subjects"}


@user_router.get("/users/{user_id}/liked-subjects", response_model=List[SubjectResponse])
async def get_liked_subjects(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve the subjects liked by the user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    liked_subjects = user.liked_subjects
    return [SubjectResponse(id=subject.id, name=subject.name) for subject in liked_subjects]

# POST endpoint to save or update user details


@user_router.post("/users/save-user", status_code=200)
async def save_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Save or update user information.
    """
    try:
        # Check if the user exists based on email, create new or update existing
        user = db.query(User).filter(User.email == user_data.email).first()
        if not user:
            new_user = User(**user_data.dict())
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return {"message": "User created successfully", "user": new_user}
        else:
            # Update user fields
            for key, value in user_data.dict().items():
                setattr(user, key, value)
            db.commit()
            return {"message": "User updated successfully", "user": user}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Failed to save user: " + str(e))

# GET endpoint to retrieve all users


@user_router.get("/users", response_model=List[UserBase], status_code=200)
async def get_all_users(db: Session = Depends(get_db)):
    """
    Get a list of all users.
    """
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

# GET endpoint to retrieve a user by ID


@user_router.get("/users/{user_id}", response_model=UserBase)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get a user by their ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@user_router.get("/me", response_model=UserCreate)
async def get_current_user_data(current_user: User = Depends(get_current_user)):
    return current_user


# POST endpoint to save or update user details (first_name, last_name, and email)
@user_router.post("/users/{user_id}/update-profile")
async def update_profile(
    user_id: int,
    first_name: str,
    last_name: str,
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update user profile including first name, last name, and email.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update basic information
    user.first_name = first_name
    user.last_name = last_name
    user.email = email

    # Commit changes to the database
    db.commit()

    return {"message": "Profile updated successfully", "user": user}
