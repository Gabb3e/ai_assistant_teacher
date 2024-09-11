import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, questionCount, difficulty } = location.state || {};
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  // Fetch the quiz data
  useEffect(() => {
    const createQuiz = async () => {
      try {
        const response = await fetch('http://localhost:8000/quiz/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic,
            num_questions: questionCount,
            difficulty,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create quiz. Status: ${response.status}`);
        }

        const data = await response.json();
        setQuizId(data.quiz_id);
      } catch (err) {
        console.error('Error creating quiz:', err);
        setError('Failed to create quiz. Please try again.');
        setLoading(false);
      }
    };

    createQuiz();
  }, [topic, questionCount, difficulty]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      if (!quizId) return;

      try {
        const response = await fetch(`http://localhost:8000/quiz/${quizId}/questions`);
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz questions. Status: ${response.status}`);
        }

        const data = await response.json();
        setQuizQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setError('Failed to fetch quiz questions. Please try again.');
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizQuestions();
    }
  }, [quizId]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');  // Reset selected answer for the next question
    } else {
      // When it's the last question, finish the quiz and navigate to results
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    // Navigate to QuizResults and pass quizQuestions and userAnswers
    navigate('/QuizResults', { state: { quizQuestions, userAnswers, topic, questionCount, difficulty } });
  };

  // If there is an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // Show loading spinner or message while quiz is being fetched
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  // Get the current question
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Guard against the case where currentQuestion might be undefined
  if (!currentQuestion) {
    return <div>Invalid question data.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <div className="flex space-x-2 w-full ml-4">
            <div
              style={{
                width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
              }}
              className="h-1 bg-blue-600 rounded-full"
            ></div>
            <div
              style={{
                width: `${((quizQuestions.length - currentQuestionIndex - 1) / quizQuestions.length) * 100}%`,
              }}
              className="h-1 bg-gray-300 rounded-full"
            ></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
                selectedAnswer === option ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            className="text-gray-500"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next →' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
