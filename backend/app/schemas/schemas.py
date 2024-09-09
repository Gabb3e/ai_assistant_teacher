from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    gender: bool
    age: int
    activated: bool = True
    
    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    password_hash: str


# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):

    model_config = ConfigDict(from_attributes=True)


# Test Schemas
class TestBase(BaseModel):
    
    name: str
    difficulty: Optional[str] = None
    time_limit: Optional[int] = None  # Time in minutes

class TestCreate(TestBase):
    pass

class Test(TestBase):
    
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Question Schemas
class QuestionBase(BaseModel):
    
    question_text: str
    correct_answer: Optional[str] = None
    points: float

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    question_id: int
    model_config = ConfigDict(from_attributes=True)


# Question Option Schemas
class QuestionOptionBase(BaseModel):
   
    option_text: str
    is_correct: bool = False

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOption(QuestionOptionBase):
    option_id: int
    model_config = ConfigDict(from_attributes=True)


# Test Attempt Schemas
class TestAttemptBase(BaseModel):
    user_id: int
    test_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    score: Optional[float] = None

class TestAttemptCreate(TestAttemptBase):
    pass

class TestAttempt(TestAttemptBase):
    attempt_id: int
    model_config = ConfigDict(from_attributes=True)


# Submitted Answer Schemas
class SubmittedAnswerBase(BaseModel):
    attempt_id: int
    question_id: int
    submitted_option_id: Optional[int] = None
    submitted_text: Optional[str] = None

class SubmittedAnswerCreate(SubmittedAnswerBase):
    pass

class SubmittedAnswer(SubmittedAnswerBase):
    answer_id: int
    model_config = ConfigDict(from_attributes=True)


# ChatRequest and ChatResponse Schemas
class ChatRequestModel(BaseModel):
    user_input: str

class ChatResponseModel(BaseModel):
    ai_response: str

    model_config = ConfigDict(from_attributes=True)


# Quiz Models for Request and Response
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
    
# Auth Schemas

class Token(BaseModel):
    access_token: str
    token_type: str
    model_config = ConfigDict(from_attributes=True)

class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None

class UserOutSchema(BaseModel):
    id: int
    email: EmailStr
    last_name: str
    first_name: str
    model_config = ConfigDict(from_attributes=True)


class UserRegisterSchema(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    age: int
    gender: bool
    
    model_config = ConfigDict(from_attributes=True)


class SubjectInSchema(BaseModel):
    subject: str

    model_config = ConfigDict(from_attributes=True)
