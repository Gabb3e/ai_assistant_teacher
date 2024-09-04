from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    gender: bool
    age: int
    activated: bool = True

class UserCreate(UserBase):
    password_hash: str

class User(UserBase):
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    subject_id: int
    model_config = ConfigDict(from_attributes=True)

class TestBase(BaseModel):
    subject_id: int
    name: str
    difficulty: Optional[str] = None
    time_limit: Optional[int] = None  # Time in minutes

class TestCreate(TestBase):
    pass

class Test(TestBase):
    test_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class QuestionBase(BaseModel):
    test_id: int
    question_text: str
    correct_answer: Optional[str] = None
    points: float

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    question_id: int

    model_config = ConfigDict(from_attributes=True)

class QuestionOptionBase(BaseModel):
    question_id: int
    option_text: str
    is_correct: bool = False

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOption(QuestionOptionBase):
    option_id: int
    model_config = ConfigDict(from_attributes=True)

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
