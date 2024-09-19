from fastapi import FastAPI, HTTPException, Depends, status, Request, Query, File, UploadFile
from db_setup import init_db, get_db, engine
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select, update, delete, insert
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from models.models import ChatRequest, ChatResponse, QuizModel, QuizQuestionModel, User, Base, Subject
from schemas.schemas import ChatRequestModel, ChatResponseModel, QuizCreateResponseModel, QuizCreateRequestModel, QuestionModel, UserCreate, UserBase
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
import shutil
import openai

# uvicorn main:app --reload


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)


# Add CORS middleware to allow your frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes here
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(quiz_router)


def load_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not found",
        )
    return api_key


def extract_json_from_response(ai_response: str) -> str:
    """
    Attempts to extract the JSON-like part of the AI response using regular expressions.
    This function looks for the first valid JSON array in the response.
    """
    # Regular expression to match the first JSON array in the response
    match = re.search(r'(\[\s*\{.*?\}\s*\])', ai_response, re.DOTALL)
    if match:
        return match.group(1)  # Return the matched JSON content
    else:
        print("No valid JSON array found in the AI response.")
        return None

def parse_quiz_response_ray(ai_response: str):
    """
    Parse the AI response to extract questions, ensuring it's valid JSON.
    """
    try:
        # Clean up response by stripping extra characters like newlines and spaces
        ai_response = ai_response.strip()

        # Print response for debugging
        print(f"Cleaned AI Response: {ai_response}")

        # Attempt to parse the cleaned AI response directly as JSON
        quiz_data = json.loads(ai_response)

        if not isinstance(quiz_data, list):
            print("Extracted JSON is not a valid list of questions.")
            return []

        parsed_questions = []
        for question in quiz_data:
            # Ensure all required keys are present
            if 'question' not in question or 'options' not in question or 'correct_answer' not in question or 'explanation' not in question:
                print(f"Invalid question structure or missing fields: {question}")
                raise ValueError("Question is missing necessary fields ('question', 'options', 'correct_answer', 'explanation').")

            # Append the parsed question, including explanation, to the list
            parsed_questions.append({
                'question': question['question'],
                'options': question['options'],
                'correct_answer': question['correct_answer'],
                'explanation': question['explanation']  # Include the explanation in the response
            })

        print("Parsed questions successfully.")
        return parsed_questions

    except json.JSONDecodeError as e:
        print(f"Failed to parse AI response. JSONDecodeError: {e}")
        return []

    except ValueError as e:
        print(f"Error in quiz structure: {e}")
        return []


def parse_quiz_response(ai_response: str) -> List[Dict[str, Any]]:
    """
    Parse the AI response to extract quiz questions and answers.
    Ensures the AI response is valid JSON and properly formatted.
    """
    try:
        # Step 1: Remove the code block formatting, if present
        ai_response = ai_response.strip()  # Remove leading/trailing whitespace
        if ai_response.startswith("```json"):
            ai_response = re.sub(r"```json\n|\n```", "", ai_response).strip()

        # Step 2: Extract JSON from AI response
        json_content = extract_json_from_response(ai_response)
        if not json_content:
            print("AI response does not contain valid JSON.")
            return []

        # Step 3: Attempt to parse the extracted JSON content
        quiz_data = json.loads(json_content)

        if not isinstance(quiz_data, list):
            print("Extracted JSON is not a valid list of questions.")
            return []

        # Step 4: Validate and structure each quiz question
        parsed_questions = []
        for question in quiz_data:
            # Ensure all required keys are present
            if 'question' not in question or 'options' not in question or 'correct_answer' not in question or 'explanation' not in question:
                print(f"Invalid question structure or missing fields: {question}")
                raise ValueError("Question is missing necessary fields ('question', 'options', 'correct_answer', 'explanation').")

            # Append each valid question to the parsed list
            parsed_questions.append({
                'question': question['question'],
                'options': question['options'],
                'correct_answer': question['correct_answer'],
                'explanation': question['explanation']
            })

        # Step 5: Return the list of parsed quiz questions
        print("Parsed questions successfully.")
        return parsed_questions

    except json.JSONDecodeError as e:
        print(f"Failed to parse AI response. JSONDecodeError: {e}")
        return []

    except ValueError as e:
        print(f"Error in quiz structure: {e}")
        return []


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
    # Injecting API key using a dependency
    api_key: str = Depends(load_api_key),
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
    # Injecting API key using a dependency
    api_key: str = Depends(load_api_key),
):
    try:
        # Validate number of questions
        if request.num_questions < 1 or request.num_questions > 50:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Number of questions must be between 1 and 50.")


        prompt = (
        f"Please create a quiz in the subject area '{request.subject}', focusing specifically on the topic '{request.topic}', with {request.num_questions} questions."
        " Each question should have four distinct answer options."
        " Mark one correct answer for each question."
        " Provide a brief explanation for why the correct answer is correct."
        " Respond in valid JSON format, with each question structured as an object containing 'question', 'options', 'correct_answer', and 'explanation'."
        )

        if request.difficulty:
            prompt += f" The difficulty level should be {request.difficulty}."

        # Add more guidance to ensure the AI provides as much detail as possible.
        prompt += (
        " Ensure that the response is formatted as a JSON array of questions. Each question should be an object with the following keys: "
        "'question' (string), 'options' (array of four strings), 'correct_answer' (string), and 'explanation' (string)."
        " The 'explanation' field should clearly explain in a few words why the correct answer is right."
        " Example: "
        " [{'question': 'What is 2 + 2?', 'options': ['3', '4', '5', '6'], 'correct_answer': '4', 'explanation': '2 + 2 equals 4 because adding two sets of two results in four.'}]."
        " Another example: "
        " [{'question': 'What is the capital of France?', 'options': ['Berlin', 'Madrid', 'Paris', 'Rome'], 'correct_answer': 'Paris', 'explanation': 'Paris is the capital of France, known for its history, culture, and landmarks like the Eiffel Tower.'}]."
        " Return only valid JSON with no additional text outside the JSON structure."
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
        db_quiz = QuizModel(
            topic=request.topic, num_questions=request.num_questions, difficulty=request.difficulty)
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
    db_questions = db.query(QuizQuestionModel).filter(
        QuizQuestionModel.quiz_id == quiz_id).all()

    if not db_questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No questions found for this quiz.")

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



@app.post("/voice-assistant/", tags=["Voice Assistant"])
async def handle_voice_assistant(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to a local directory
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        file_location = f"{upload_dir}/{file.filename}"
        
        # Log the file location for debugging
        print(f"Saving file to: {file_location}")
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Log the file saved
        print(f"File saved at {file_location}")

        # Use OpenAI Whisper API to transcribe the audio file
        with open(file_location, "rb") as audio_file:
            print("Sending audio to OpenAI Whisper API...")
            transcription = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        
        # Clean up file after processing
        if os.path.exists(file_location):
            os.remove(file_location)
            print(f"File {file_location} deleted after processing.")
        else:
            print(f"File {file_location} not found for deletion.")

        # Return the AI response (transcription text)
        return {"ai_response": transcription}

    except Exception as e:
        # Log the exact error for debugging
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing voice input: {str(e)}")


