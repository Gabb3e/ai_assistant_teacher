from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String, Boolean, BigInteger, TIMESTAMP, Text, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func

Base = declarative_base()
    
class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    gender = Column(Boolean, nullable=False)
    age = Column(BigInteger, nullable=False)
    activated = Column(Boolean, nullable=False, default=True)

    test_attempts = relationship("TestAttempt", back_populates="user")


class Subject(Base):
    __tablename__ = 'subjects'

    subject_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)

    tests = relationship("Test", back_populates="subject")


class Test(Base):
    __tablename__ = 'tests'

    test_id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey('subjects.subject_id'), nullable=False)
    name = Column(String(255), nullable=False)
    difficulty = Column(String(50))
    time_limit = Column(Integer)  # Time in minutes
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    subject = relationship("Subject", back_populates="tests")
    questions = relationship("Question", back_populates="test")
    test_attempts = relationship("TestAttempt", back_populates="test")


class Question(Base):
    __tablename__ = 'questions'

    question_id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey('tests.test_id'), nullable=False)
    question_text = Column(Text, nullable=False)
    correct_answer = Column(Text)
    points = Column(Numeric, nullable=False)

    test = relationship("Test", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question")
    submitted_answers = relationship("SubmittedAnswer", back_populates="question")


class QuestionOption(Base):
    __tablename__ = 'question_options'

    option_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.question_id'), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")


class TestAttempt(Base):
    __tablename__ = 'test_attempts'

    attempt_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    test_id = Column(Integer, ForeignKey('tests.test_id'), nullable=False)
    start_time = Column(TIMESTAMP(timezone=True))
    end_time = Column(TIMESTAMP(timezone=True))
    score = Column(Numeric)

    user = relationship("User", back_populates="test_attempts")
    test = relationship("Test", back_populates="test_attempts")
    submitted_answers = relationship("SubmittedAnswer", back_populates="test_attempt")


class SubmittedAnswer(Base):
    __tablename__ = 'submitted_answers'

    answer_id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey('test_attempts.attempt_id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.question_id'), nullable=False)
    submitted_option_id = Column(Integer, ForeignKey('question_options.option_id'))
    submitted_text = Column(Text)

    test_attempt = relationship("TestAttempt", back_populates="submitted_answers")
    question = relationship("Question", back_populates="submitted_answers")