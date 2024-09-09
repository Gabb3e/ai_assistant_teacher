from openai import OpenAI
from pydantic import BaseModel  
import os
import re
from fastapi import FastAPI, HTTPException, Depends, Request, status, APIRouter
from typing import List, Dict, Any
from dotenv import load_dotenv
from schemas.schemas import ChatRequestModel, ChatResponseModel, QuizCreateResponseModel, QuizCreateRequestModel, QuestionModel, UserCreate, UserBase, SubjectInSchema

quiz_router = APIRouter(tags=["bizz"])


load_dotenv()

client = OpenAI()


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not found",
        )
    return api_key



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
    #topics = parse_topics_response(ai_response)

    return {"subject": subject, "topics": ai_response}


def parse_topics_response(ai_response: str) -> List[str]:
    """
    Parse the AI response to extract topics.
    """
    # Use regex or a simple split to parse out the topics if they are in a list form
    topics = re.split(r'\d+\.\s+', ai_response.strip())
    
    # Filter out empty strings
    return [topic.strip() for topic in topics if topic.strip()]

