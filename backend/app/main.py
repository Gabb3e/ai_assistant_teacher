from fastapi import FastAPI, HTTPException, Depends, status, Request, Query
from app.db_setup import init_db, get_db, engine
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select, update, delete, insert
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from app.models.models import ChatRequest, ChatResponse, QuizModel, QuizQuestionModel, User, Base
from app.schemas.schemas import ChatRequestModel, ChatResponseModel, QuizCreateResponseModel, QuizCreateRequestModel, QuestionModel, UserCreate, UserBase
from openai import OpenAI
from auth_endpoints import auth_router
from user_endpoints import user_router
from quiz_onb_endpoints import quiz_router
import httpx
from typing import List, Dict, Any
from uuid import uuid4
import os
import re
import json

# from app.auth import get_current_user  # Assuming you have an auth dependency

# uvicorn app.main:app --reload

# Dependency to load API key from environment variables

# origin = [
#     "http://localhost:3000/",
#     "http://localhost:5173/",
#     "http://localhost:8000/"
# ]

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db() 
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(quiz_router) #So routes works in quiz_onb_endpoints

app.include_router(user_router)

app.include_router(auth_router) #So routes works in auth_endpoints
print("auth_router", auth_router)
app.add_middleware(
CORSMiddleware,
allow_origins=["*"], # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not found",
        )
    return api_key

def extract_json_from_response(ai_response: str):
    """
    Attempts to extract the JSON-like part of the AI response using regular expressions.
    This function looks for the first valid JSON array in the response.
    """
    # Regular expression to extract JSON array starting with '[' and ending with ']'
    match = re.search(r'(\[.*\])', ai_response, re.DOTALL)
    if match:
        return match.group(1)  # Return the matched JSON content
    else:
        print("No valid JSON array found in the AI response.")
        return None

def parse_quiz_response(ai_response: str):
    """
    Parse the AI response to extract questions, each with 'question', 'options', and 'correct_answer'.
    This function tries to extract the JSON part from the response first.
    """
    try:
        # Extract JSON from AI response if possible
        json_content = extract_json_from_response(ai_response)
        if not json_content:
            print("AI response does not contain valid JSON.")
            return []

        # Attempt to parse the extracted JSON
        quiz_data = json.loads(json_content)
        questions = quiz_data if isinstance(quiz_data, list) else []

        parsed_questions = []
        for question in questions:
            correct_answer = (
                question.get('correct_answer') or
                question.get('answer') or
                question.get('correctOption') or
                None
            )

            # Ensure we have the correct answer and required keys
            if not correct_answer or 'question' not in question or 'options' not in question:
                print(f"Invalid question structure or missing answer: {question}")
                raise ValueError("Question is missing necessary fields or correct answer.")

            parsed_questions.append({
                'question': question['question'],
                'options': question['options'],
                'correct_answer': correct_answer
            })

        return parsed_questions

    except json.JSONDecodeError:
        print("Failed to parse extracted JSON. It was not valid.")
        return []

    except ValueError as e:
        print(f"Error in quiz structure: {e}")
        return []


@app.post("/quiz/create", response_model=QuizCreateResponseModel, tags=["quiz"])
async def create_quiz(
    request: QuizCreateRequestModel,
    db: Session = Depends(get_db),
    api_key: str = Depends(load_api_key),
):
    try:
        prompt = (
            f"Create a quiz on the topic of '{request.topic}' with {request.num_questions} questions."
            " Each question should have four distinct answer options."
            " Mark one correct answer for each question."
            " Respond in valid JSON format, with each question structured as an object containing 'question', 'options', and 'correct_answer'."
        )

        if request.difficulty:
            prompt += f" The difficulty level should be {request.difficulty}."

        # Additional clarification for the AI to return JSON
        prompt += (
            " Ensure the response is valid JSON. Example format: "
            "[{'question': 'What is 2 + 2?', 'options': ['3', '4', '5', '6'], 'correct_answer': '4'}]."
            " Do not include any explanations or additional text, only return the JSON data."
        )

        print(f"Generated Prompt: {prompt}")

        # Get AI response
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful teacher who creates well-structured quizzes with multiple-choice questions.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        ai_response = completion.choices[0].message.content
        print(f"AI Response: {ai_response}")

        # Parse the AI response to extract questions and options
        questions = parse_quiz_response(ai_response)

        if not questions or not isinstance(questions, list):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse quiz questions."
            )

        print(f"Parsed Questions: {questions}")

        # Save the generated quiz to the database
        db_quiz = QuizModel(topic=request.topic, num_questions=request.num_questions, difficulty=request.difficulty)
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)

        # Save each question
        for q in questions:
            db_question = QuizQuestionModel(
                quiz_id=db_quiz.id,
                question=q['question'],
                options=json.dumps(q['options']),  # Store options as JSON
                correct_answer=q['correct_answer']
            )
            db.add(db_question)
        db.commit()

        # Create a response model to return
        response = QuizCreateResponseModel(
            quiz_id=db_quiz.id,
            questions=[QuestionModel(**q) for q in questions]
        )

        return response

    except HTTPException as e:
        raise e  # Rethrow any HTTPExceptions we explicitly raised

    except Exception as e:
        # Log the error and return a more informative error message
        print(f"Error during quiz creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the quiz. Please try again later."
        )


# In-memory store for conversations (for simplicity)
conversations: Dict[str, List[Dict[str, str]]] = {}

client = OpenAI()

#################################   endpoints   #################################

@app.post("/reset-db", status_code=200, tags=["Database"])
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return {"message": "Database was successfully reset."}

# This endpoint will receive the user's response from the front-end, send it to the LLM, and return the AI's response.

@app.post("/chat", response_model=ChatResponseModel, tags=["chat"])
async def chat_with_ai(
    request: ChatRequestModel,
    db: Session = Depends(get_db),  # Injecting DB session for consistency
    api_key: str = Depends(load_api_key),  # Injecting API key using a dependency
):
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpfull teacher who creates quizes for the choosen topic with the choosen amount of questions.",
                },
                {"role": "user", "content": request.user_input},
            ],
        )

        ai_response = completion.choices[0].message.content
        print(ai_response)
        # Save the response to the database
        db_chat_response = ChatResponse(ai_response=ai_response)
        db.add(db_chat_response)
        db.commit()
        db.refresh(db_chat_response)

        return ChatResponseModel.from_orm(db_chat_response)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

@app.post("/quiz/create", response_model=QuizCreateResponseModel, tags=["quiz"])
async def create_quiz(
    request: QuizCreateRequestModel,
    db: Session = Depends(get_db),  # Injecting DB session for consistency
    api_key: str = Depends(load_api_key),  # Injecting API key using a dependency
):
    try:
        prompt = (
            f"Create a quiz on the topic of '{request.topic}' with {request.num_questions} questions."
            " Each question should have four distinct answer options."
            " Mark one correct answer for each question."
            " Respond in valid JSON format, with each question structured as an object containing 'question', 'options', and 'correct_answer'."
)
        
        if request.difficulty:
            prompt += f" The difficulty level should be {request.difficulty}."

        # Add more guidance to ensure the AI provides as much detail as possible.
        prompt += (
            " Ensure that the response is formatted as a JSON array of questions. Each question should be an object with keys: "
            "'question' (string), 'options' (array of strings), and 'correct_answer' (string)."
            " Example: [{'question': 'What is 2 + 2?', 'options': ['3', '4', '5', '6'], 'correct_answer': '4'}]."
            " Return only valid JSON with no additional explanations or text."
)

        # Logging the final prompt
        print(f"Generated Prompt: {prompt}")

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful teacher who creates well-structured quizzes with multiple-choice questions.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        ai_response = completion.choices[0].message.content
        print(ai_response)

        # Here, you would typically parse `ai_response` to extract questions and options
        # Assuming `ai_response` is structured correctly as a JSON-like response:
        questions = parse_quiz_response(ai_response)
        if not questions or not isinstance(questions, list):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse quiz questions."
            )
        print(f"Parsed Questions: {questions}")

        # Save the generated quiz to the database
        db_quiz = QuizModel(topic=request.topic, num_questions=request.num_questions, difficulty=request.difficulty)
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)

        # Save each question
        for q in questions:
            db_question = QuizQuestionModel(
                quiz_id=db_quiz.id,
                question=q['question'],
                options=json.dumps(q['options']),  # Store options as JSON
                correct_answer=q['correct_answer']
            )
            db.add(db_question)
        db.commit()

        # Create a response model to return
        response = QuizCreateResponseModel(
            quiz_id=db_quiz.id,
            questions=[QuestionModel(**q) for q in questions]
        )

        return response

    except HTTPException as e:
        raise e  # Rethrow any HTTPExceptions we explicitly raised

    except Exception as e:
        # Log the error and return a more informative error message
        print(f"Error during quiz creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the quiz. Please try again later."
        )

@app.get("/quiz/{quiz_id}/questions", response_model=QuizCreateResponseModel, tags=["quiz"])
async def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    # Fetch the quiz from the database
    db_quiz = db.query(QuizModel).filter(QuizModel.id == quiz_id).first()

    if not db_quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz with id {quiz_id} not found."
        )

    # Fetch all questions related to the quiz
    db_questions = db.query(QuizQuestionModel).filter(QuizQuestionModel.quiz_id == quiz_id).all()

    if not db_questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No questions found for this quiz.")

    # Map the database questions to the response model
    questions = [
        QuestionModel(
            question=q.question,
            options=json.loads(q.options),  # Parse JSON options
            correct_answer=q.correct_answer
        )
        for q in db_questions
    ]

    response = QuizCreateResponseModel(
        quiz_id=db_quiz.id,
        questions=questions
    )

    return response



# This endpoint will allow the user to continue the conversation with the AI. It will handle back-and-forth communication.
@app.post("/chat/continue", response_model=ChatResponseModel, tags=["chat"])
async def continue_chat_with_ai(
    request: ChatRequestModel,
    session_id: str = None,
    db: Session = Depends(get_db),
    api_key: str = Depends(load_api_key),
):
    if not session_id:
        session_id = str(uuid4())

    if session_id not in conversations:
        conversations[session_id] = []

    # Add user input to the conversation history
    conversations[session_id].append(
        {"role": "user", "content": request.user_input})

    try:
        # Call the OpenAI API with the entire conversation history
        completion = client.chat.completions.create(
            model="gpt-4o-mini", messages=conversations[session_id]
        )

        ai_response = completion.choices[0].message.content
        # Add AI response to the conversation history
        conversations[session_id].append(
            {"role": "ai", "content": ai_response})

        # Save the response to the database
        db_chat_response = ChatResponse(ai_response=ai_response)
        db.add(db_chat_response)
        db.commit()
        db.refresh(db_chat_response)

        return ChatResponseModel.from_orm(db_chat_response)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

# If you want to maintain a chat history, this endpoint can fetch previous messages between the user and the AI.


@app.get("/chat/history", tags=["chat"])
async def chat_history(session_id: str):
    if session_id not in conversations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session ID not found"
        )

    return {"session_id": session_id, "history": conversations[session_id]}


@app.get("/user", status_code=200, tags=["User"])
async def get_users(db: Session = Depends(get_db)):
    """
    Get all users
    """
    result = db.query(User.first_name, User.last_name)
    
    if not result:
        return HTTPException(status_code=404, detail="User not found")
    return result

@app.get("/user/{id}", status_code=200, tags=["User"])
async def get_users(id: int, db: Session = Depends(get_db)):
    """
    Get a user by ID
    """
    result = db.execute(select(User).filter(User.id == id))
    if not result:
        return HTTPException(status_code=404, detail="User not found")
    return {"users": "Successfully fetched users."}

