from openai import OpenAI
from pydantic import BaseModel  
from db_setup import init_db, get_db, engine
import os
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi import FastAPI, HTTPException, Depends, Request, status, APIRouter
from typing import List, Dict, Any
from dotenv import load_dotenv
from schemas.schemas import UserBase, SubjectResponse, SubjectLikeRequest
from models.models import User, user_likes_subject, Subject, Topic



@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db() 
    yield

app = FastAPI(lifespan=lifespan)
load_dotenv()

client = OpenAI()
user_router = APIRouter(tags=["Creation"])


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not found",
        )
    return api_key

@user_router.post("/users/{user_id}/onboarding", response_model=SubjectResponse)
async def onboarding_add_subject(user_id: int, request: SubjectLikeRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create or find subject based on user input (can be integrated with ChatGPT subject generation)
    subject = db.query(Subject).filter(Subject.name == request.subject_name).first()
    if not subject:
        # Create new subject if not found
        subject = Subject(name=request.subject_name)
        db.add(subject)
        db.commit()
        db.refresh(subject)

    # Add the subject to the user's liked subjects
    if subject not in user.liked_subjects:
        user.liked_subjects.append(subject)
        db.commit()

    return SubjectResponse(id=subject.id, name=subject.name)



@user_router.post("/users/{user_id}/add-subject", response_model=SubjectResponse)
async def add_new_subject(user_id: int, request: SubjectLikeRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create or find subject based on user input
    subject = db.query(Subject).filter(Subject.name == request.subject_name).first()
    if not subject:
        # Create new subject if not found
        subject = Subject(name=request.subject_name)
        db.add(subject)
        db.commit()
        db.refresh(subject)

    # Add the subject to the user's liked subjects
    if subject not in user.liked_subjects:
        user.liked_subjects.append(subject)
        db.commit()

    return SubjectResponse(id=subject.id, name=subject.name)


# Endpoint 2: Get subjects liked by a user
@user_router.get("/users/{user_id}/liked-subjects", response_model=List[SubjectResponse])
async def get_liked_subjects(user_id: int, db: Session = Depends(get_db)):
    # Fetch the user from the database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Retrieve all liked subjects
    liked_subjects = user.liked_subjects
    return [SubjectResponse(id=subject.id, name=subject.name) for subject in liked_subjects]




