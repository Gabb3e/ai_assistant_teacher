from openai import OpenAI
from pydantic import BaseModel
import os
import json
import re
from fastapi import FastAPI, HTTPException, Depends, Request, status, APIRouter
from typing import List, Dict, Any
from dotenv import load_dotenv
from sqlalchemy.orm import Session, joinedload

from db_setup import get_db
from models.models import User, Subject  # Correct import for User and Subject
# Correct import for SubjectInSchema
from schemas.schemas import SubjectInSchema
from security import get_current_user

quiz_router = APIRouter(tags=["bizz"])

load_dotenv()

client = OpenAI()

# Function to load the API key


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not found",
        )
    print(f"Loaded API key: {api_key}")
    return api_key

# Example route


@quiz_router.post("/generate-topics", status_code=200, tags=["Topics"])
async def generate_topics(subject_request: SubjectInSchema):
    """
    Generate related topics using OpenAI API based on the given subject.
    """
    # Load the OpenAI API key
    OpenAI.api_key = load_api_key()

    subject = subject_request.subject

    # OpenAI API call to generate topics
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an assistant that generates topics.In json. Example: {'subject': 'Python', 'topics': ['Data types', 'Loops', 'Functions', 'Classes', 'Modules']}"},
                {"role": "user", "content": f"Generate 5 topics related to {subject}."}
            ],
            max_tokens=200
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to call OpenAI API: {e}"
        )

    # Extract generated topics from response
    ai_response = response.choices[0].message.content
    topics = parse_topics_response(ai_response)

    return {"subject": subject, "topics": topics}


def parse_topics_response(ai_response: str) -> List[str]:
    """
    Parse the AI response to extract topics, removing any code block formatting and parsing the JSON.
    """
    # Step 1: Remove the code block formatting, if present
    ai_response = ai_response.strip()  # Remove leading/trailing whitespace
    if ai_response.startswith("```json"):
        ai_response = re.sub(r"```json\n|\n```", "", ai_response).strip()

    # Step 2: Parse the JSON to extract the "topics" field
    try:
        parsed_response = json.loads(ai_response)
        topics = parsed_response.get('topics', [])
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse JSON response: {e}"
        )

    return topics


# Pydantic schema to accept the subjects list
class SubjectSaveSchema(BaseModel):
    subjects: List[str]


@quiz_router.post("/users/save-subjects", status_code=200)
def save_subjects(subjects: SubjectSaveSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # Clear current liked subjects
        current_user.liked_subjects.clear()

        # Add new subjects to the user's liked subjects
        for subject_name in subjects.subjects:
            subject = db.query(Subject).filter(
                Subject.name == subject_name).first()
            if not subject:
                subject = Subject(name=subject_name)
                db.add(subject)
                db.flush()  # Ensure subject is added to the DB before appending

            current_user.liked_subjects.append(subject)

        db.commit()
        return {"message": "Subjects saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to save subjects: {str(e)}"
        )


# GET endpoint to fetch subjects selected during onboarding
@quiz_router.get("/users/{user_id}/onboarding-subjects", status_code=200)
def get_onboarding_subjects(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Fetch the subjects selected by the user during onboarding.
    """
    try:
        # Check authorization
        if current_user.id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to access this user's subjects"
            )

        # Eagerly load the subjects relationship to avoid lazy loading issues
        current_user = db.query(User).options(joinedload(
            User.liked_subjects)).filter(User.id == user_id).first()

        # Check if the user has any liked subjects
        if not current_user.liked_subjects:
            raise HTTPException(
                status_code=404, detail="No subjects found for this user"
            )

        # Debugging: print subjects found
        print(f"Fetching subjects for user_id: {user_id}")
        print(f"Current user subjects: {current_user.liked_subjects}")

        # Return the list of subjects
        return {"subjects": [subject.name for subject in current_user.liked_subjects]}

    except HTTPException as e:
        # Properly raise the HTTP exceptions (404 or 403) without turning them into 500 errors
        raise e  # Pass the exception directly to FastAPI, so it responds with the correct status code

    except Exception as e:
        # Log the error and raise a 500 Internal Server Error for unexpected exceptions
        print(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Internal Server Error"
        )
