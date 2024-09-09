import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';
// work in progress
const QuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, topic, questionCount, difficulty } = location.state || {};
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the quiz data from the backend
    const fetchQuiz = async () => {
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

        if (response.ok) {
          const data = await response.json();
          setQuizQuestions(data.questions);
          setLoading(false);
        } else {
          console.error('Failed to fetch quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [topic, questionCount, difficulty]);

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      navigate('/QuizResults', { state: { quizQuestions } });
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
          <div className="flex space-x-2 w-full ml-4">
            <div className={`h-1 bg-blue-600 rounded-full w-${currentQuestionIndex + 1}/${quizQuestions.length}`}></div>
            <div className={`h-1 bg-gray-300 rounded-full w-${quizQuestions.length - currentQuestionIndex - 1}/${quizQuestions.length}`}></div>
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
          <button className="text-gray-500" disabled={currentQuestionIndex === 0}>Back</button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            disabled={!selectedAnswer} // Disable until an answer is selected
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next →' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
