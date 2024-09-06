import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const QuestionPage = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleNext = () => {
    navigate('/QuizResults');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
       <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">Question 1 of 10</span>
          <div className="flex space-x-2 w-full ml-4">
            <div className="h-1 bg-blue-600 rounded-full w-1/10"></div>
            <div className="h-1 bg-gray-300 rounded-full w-9/10"></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            What is the time complexity of accessing an element in a hash table?
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button
            onClick={() => handleAnswerSelect('O(1)')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedAnswer === 'O(1)' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            O(1)
          </button>
          <button
            onClick={() => handleAnswerSelect('O(n)')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedAnswer === 'O(n)' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            O(n)
          </button>
          <button
            onClick={() => handleAnswerSelect('O(log n)')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedAnswer === 'O(log n)' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            O(log n)
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button className="text-gray-500">Back</button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
