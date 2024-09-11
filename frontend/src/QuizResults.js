import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Assuming the quiz result data is passed via state
  const { quizQuestions, userAnswers, topic, questionCount, difficulty } = location.state || {};

  useEffect(() => {
    // Debugging output to check if state was passed correctly
    console.log('Quiz Questions:', quizQuestions);
    console.log('User Answers:', userAnswers);
    console.log('Location State:', location.state);
  }, [quizQuestions, userAnswers, location.state]);
  
  const handleRetakeQuiz = () => {
    // Navigate back to QuestionPage with the original quiz configuration
    navigate('/QuizPage', {
      state: {
        topic,
        questionCount,
        difficulty,
      },
    });
  };

  const handleDone = () => {
    navigate('/dashboard'); // Navigate back to the dashboard
  };

  // If no quiz data is available (e.g., if user navigates directly to this page)
  if (!quizQuestions || !userAnswers) {
    return <div>No quiz results available.</div>;
  }

  // Calculate the score
  const score = quizQuestions.reduce((acc, question, index) => {
    return acc + (userAnswers[index] === question.correct_answer ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white pt-32 pb-16">
      <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Quiz Results</h1>
      <div className="w-full max-w-3xl mx-auto">
        {/* Summary Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            You scored {score} out of {quizQuestions.length}!
          </h2>
          <p className="text-gray-500 mt-2">
            Here's a breakdown of your answers:
          </p>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {quizQuestions.map((question, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-2">Question {index + 1}:</h3>
              <p className="text-gray-700 mb-4">{question.question}</p>
              <p
                className={`font-bold ${userAnswers[index] === question.correct_answer ? 'text-green-600' : 'text-red-600'}`}
              >
                Your answer: {userAnswers[index]} - {userAnswers[index] === question.correct_answer ? 'Correct!' : 'Incorrect'}
              </p>
              {userAnswers[index] !== question.correct_answer && (
                <p className="text-gray-500">Correct answer: {question.correct_answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={handleRetakeQuiz} className="text-gray-500">
            Retake Quiz
          </button>
          <button onClick={handleDone} className="bg-blue-600 text-white py-2 px-6 rounded-lg">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
