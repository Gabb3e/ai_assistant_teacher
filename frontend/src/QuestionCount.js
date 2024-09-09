import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const QuestionCount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get subject and topic from the previous step
  const { subject, topic } = location.state || {}; 

  const [selectedCount, setSelectedCount] = useState('');

  const handleContinue = () => {
    // Pass the subject, topic, and selected question count to the next step
    navigate('/KnowledgeLevel', { state: { subject, topic, questionCount: selectedCount } });
  };

  const handleBack = () => {
    // Pass subject and topic back when navigating to the previous page
    navigate('/TopicSelection', { state: { subject, topic } });
  };

  const handleSelectCount = (count) => {
    setSelectedCount(count);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-between mb-8">
          <span className="text-gray-600 mb-2">Step: 3 of 4</span>
          <div className="flex space-x-2 w-full justify-center">
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            How many quiz questions would you like?
          </h2>
          <p className="text-gray-500 mt-2">
            This helps us better tailor our questions to fit your topics
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleSelectCount('10')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedCount === '10' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            10
          </button>
          <button
            onClick={() => handleSelectCount('15')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedCount === '15' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            15
          </button>
          <button
            onClick={() => handleSelectCount('20')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedCount === '20' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            20
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="text-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            disabled={!selectedCount} // Disable button if no question count is selected
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCount;
