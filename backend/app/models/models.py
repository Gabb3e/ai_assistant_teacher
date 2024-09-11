from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, BigInteger, TIMESTAMP, Text, ForeignKey, Numeric, DateTime, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime

class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)

user_likes_subject = Table(
    'user_likes_subject', Base.metadata,
    Column('user_id', ForeignKey('users.id'), primary_key=True),
    Column('subject_id', ForeignKey('subjects.id'), primary_key=True)
)
# User Model
class User(Base):
    __tablename__ = 'users'

    
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    gender: Mapped[bool] = mapped_column(Boolean, nullable=False)
    age: Mapped[int] = mapped_column(BigInteger, nullable=False)
    activated: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_login: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    login_streak: Mapped[int] = mapped_column(Integer, default=0)

    # Relationship to login history
    login_history: Mapped[list["LoginHistory"]] = relationship("LoginHistory", back_populates="user")


    test_attempts: Mapped[list["TestAttempt"]] = relationship("TestAttempt", back_populates="user")

    # Many-to-Many relationship with Subjects (liked subjects)
    liked_subjects: Mapped[list["Subject"]] = relationship(
        "Subject", secondary=user_likes_subject, back_populates="liked_by_users"
    )

# Subject Model
class Subject(Base):
    __tablename__ = 'subjects'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationship with topics
    topics: Mapped[list["Topic"]] = relationship("Topic", back_populates="subject")

    tests: Mapped[list["Test"]] = relationship("Test", back_populates="subject")


    # Many-to-Many relationship with User (likes)
    liked_by_users: Mapped[list["User"]] = relationship(
        "User", secondary=user_likes_subject, back_populates="liked_subjects"
    )
class Topic(Base):
    __tablename__ = 'topics'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey('subjects.id'), nullable=False)

    subject: Mapped["Subject"] = relationship("Subject", back_populates="topics")
    tests: Mapped[list["Test"]] = relationship("Test", back_populates="topic")


# Test Model
class Test(Base):
    __tablename__ = 'tests'

    
    subject_id: Mapped[int] = mapped_column(ForeignKey('subjects.id'), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    difficulty: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    topic_id: Mapped[int] = mapped_column(ForeignKey('topics.id'), nullable=False)
    
    topic: Mapped["Topic"] = relationship("Topic", back_populates="tests")
    subject: Mapped["Subject"] = relationship("Subject", back_populates="tests")

    questions: Mapped[list["Question"]] = relationship("Question", back_populates="test")
    test_attempts: Mapped[list["TestAttempt"]] = relationship("TestAttempt", back_populates="test")

# Question Model
class Question(Base):
    __tablename__ = 'questions'

    test_id: Mapped[int] = mapped_column(ForeignKey('tests.id'), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    correct_answer: Mapped[Optional[str]] = mapped_column(Text)
    points: Mapped[float] = mapped_column(Numeric, nullable=False)

    test: Mapped["Test"] = relationship("Test", back_populates="questions")  
    options: Mapped[list["QuestionOption"]] = relationship("QuestionOption", back_populates="question")
    submitted_answers: Mapped[list["SubmittedAnswer"]] = relationship("SubmittedAnswer", back_populates="question")

# Question Option Model
class QuestionOption(Base):
    __tablename__ = 'question_options'

    
    question_id: Mapped[int] = mapped_column(ForeignKey('questions.id'), nullable=False)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)

    question: Mapped["Question"] = relationship("Question", back_populates="options")

# Test Attempt Model
class TestAttempt(Base):
    __tablename__ = 'test_attempts'

    
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    test_id: Mapped[int] = mapped_column(ForeignKey('tests.id'), nullable=False)
    start_time: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))
    end_time: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))
    score: Mapped[Optional[float]] = mapped_column(Numeric)

    user: Mapped["User"] = relationship("User", back_populates="test_attempts")
    test: Mapped["Test"] = relationship("Test", back_populates="test_attempts")
    submitted_answers: Mapped[list["SubmittedAnswer"]] = relationship("SubmittedAnswer", back_populates="test_attempt")

# Submitted Answer Model
class SubmittedAnswer(Base):
    __tablename__ = 'submitted_answers'

    attempt_id: Mapped[int] = mapped_column(ForeignKey('test_attempts.id'), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey('questions.id'), nullable=False)
    submitted_option_id: Mapped[Optional[int]] = mapped_column(ForeignKey('question_options.id'))
    submitted_text: Mapped[Optional[str]] = mapped_column(Text)

    test_attempt: Mapped["TestAttempt"] = relationship("TestAttempt", back_populates="submitted_answers")
    question: Mapped["Question"] = relationship("Question", back_populates="submitted_answers")

# ChatRequest Model
class ChatRequest(Base):
    __tablename__ = "chat_requests"

    user_input: Mapped[str] = mapped_column(Text, nullable=False)

# ChatResponse Model
class ChatResponse(Base):
    __tablename__ = "chat_responses"

    ai_response: Mapped[str] = mapped_column(Text, nullable=False)

# Quiz Model
class QuizModel(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=False)
    num_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    difficulty: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    questions: Mapped[list["QuizQuestionModel"]] = relationship("QuizQuestionModel", back_populates="quiz", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<QuizModel id={self.id} topic={self.topic} difficulty={self.difficulty}>"

# Quiz Question Model
class QuizQuestionModel(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[str] = mapped_column(Text, nullable=False)  # Store options as JSON or delimited string
    correct_answer: Mapped[str] = mapped_column(String(100), nullable=False)

    quiz: Mapped["QuizModel"] = relationship("QuizModel", back_populates="questions")

    def __repr__(self):
        return f"<QuizQuestionModel id={self.id} quiz_id={self.quiz_id} question={self.question}>"

class LoginHistory(Base):
    __tablename__ = 'login_history'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    login_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    ip_address: Mapped[str] = mapped_column(String, nullable=False)

    # Relationship back to user
    user: Mapped[User] = relationship("User", back_populates="login_history")

