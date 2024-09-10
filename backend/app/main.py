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
from app.auth_endpoints import auth_router
from app.quiz_onb_endpoints import quiz_router
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

def parse_quiz_response(ai_response: str) -> List[Dict[str, Any]]:
    # Split response into blocks of questions using regex for "Question" pattern.
    question_blocks = re.split(r'\*\*Question\s*\d+:\*\*', ai_response.strip())

    questions = []

    # Loop over each block, skipping the introductory block (block 0)
    for idx, block in enumerate(question_blocks):
        block = block.strip()  # Remove extra whitespace

        # Skip the introductory or any non-question blocks
        if idx == 0 or not block:
            continue

        question_dict = {}
        print(f"Processing block {idx}: {block}")  # Debugging line to inspect each block

        # Try to extract question text by looking for options (e.g., "a)")
        question_match = re.search(r'(.+?)\n[aA]\)', block, re.S)
        if question_match:
            question_dict['question'] = question_match.group(1).strip()
        else:
            # Log or raise an error if the question text cannot be found
            raise ValueError(f"Question text not found in block {idx}: {block}")

        # Extract options (a) to d), supporting both lowercase and uppercase letters
        options_match = re.findall(r'[a-dA-D]\)\s*(.+)', block)
        if options_match:
            question_dict['options'] = [option.strip() for option in options_match]
        else:
            # If no options are found, raise an error
            raise ValueError(f"Options not found for question {idx}: {question_dict.get('question', 'Unknown')}")

        questions.append(question_dict)

    # Print the full response for debugging purposes
    print(f"Full AI Response: {ai_response}")  # This will print the AI response for inspection

    # Extract the answers key from the response
    answer_key_match = re.search(r'(###\s*Answers?|Answer\s*Key|Answers?)\s*[:\n-]?\s*(.+)', ai_response, re.S)
    if answer_key_match:
        answer_key_block = answer_key_match.group(2).strip()

        # Debugging: Print the extracted answer key
        print(f"Extracted Answer Key Block: {answer_key_block}")

        # Extract each answer using regex for "number) Answer"
        answer_matches = re.findall(r'(\d+)[\.\)]?\s*([A-Da-d])[\)\.]?\s*', answer_key_block)
        if answer_matches:
            for idx, (question_num, correct_option) in enumerate(answer_matches):
                correct_index = ['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].index(correct_option)
                correct_index = correct_index % 4  # Normalize to 0-3 for lowercase and uppercase
                # Assign the correct answer to the corresponding question
                if idx < len(questions):
                    questions[idx]['correct_answer'] = questions[idx]['options'][correct_index]
                else:
                    raise ValueError(f"Answer provided for question {idx+1} that does not exist.")
        else:
            raise ValueError("No valid answers found in the answer key.")
    else:
        # Print AI response for further investigation
        print(f"AI Response when searching for answer key: {ai_response}")
        raise ValueError("Answer key not found in the AI response.")

    return questions

@app.post("/reset-db", status_code=200, tags=["Database"])
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return {"message": "Database was successfully reset."}

# In-memory store for conversations (for simplicity)
conversations: Dict[str, List[Dict[str, str]]] = {}

client = OpenAI()

#################################   endpoints   #################################


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
        prompt = f"Create a quiz with {request.num_questions} questions on the topic of {request.topic}."
        if request.difficulty:
            prompt += f" The difficulty level should be {request.difficulty}."

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpfull teacher who creates quizes for the choosen topic with the choosen amount of questions.",
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
        print(questions)

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

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
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

