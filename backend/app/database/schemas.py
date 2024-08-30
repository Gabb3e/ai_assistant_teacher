from pydantic import BaseModel, Field, ConfigDict, EmailStr,constr
from enum import Enum
from typing import List, Optional
from datetime import datetime, timezone


# Pydantic models for request and response validation
class ChatRequestModel(BaseModel):
    user_input: str

class ChatResponseModel(BaseModel):
    ai_response: str

    class Config:
        orm_mode = True  # Tells Pydantic to convert from SQLAlchemy model to Pydantic model
        from_attributes = True

class QuizCreateRequestModel(BaseModel):
    topic: str
    num_questions: int
    difficulty: Optional[str] = None

class QuestionModel(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizCreateResponseModel(BaseModel):
    quiz_id: int
    questions: List[QuestionModel]