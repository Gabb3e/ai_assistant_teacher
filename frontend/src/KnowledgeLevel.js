import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';

const KnowledgeLevel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve subject, topic, and question count from previous step
  const { subject, topic, questionCount } = location.state || {};

  const [selectedLevel, setSelectedLevel] = useState('');

  const handleContinue = () => {
    // Pass subject, topic, question count, and selected level to the next page (QuizPage)
    navigate('/QuizPage', { state: { subject, topic, questionCount, difficulty: selectedLevel } });
  };

  const handleBack = () => {
    // Pass subject, topic, and questionCount back to the previous page
    navigate('/QuestionCount', { state: { subject, topic, questionCount } });
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AppNavbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">Step: 4 of 4</span>
          <div className="flex space-x-2 w-full ml-4">
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            How much knowledge do you have about {topic}?
          </h2>
          <p className="text-gray-500 mt-2">
            This helps us get a better understanding of your experience to better customize the difficulty grade.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleLevelSelect('Beginner')}
            className={`border border-gray-300 p-4 rounded-lg text-black ${
              selectedLevel === 'Beginner' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => handleLevelSelect('Intermediate')}
            className={`border border-gray-300 p-4 rounded-lg text-black ${
              selectedLevel === 'Intermediate' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => handleLevelSelect('Advanced')}
            className={`border border-gray-300 p-4 rounded-lg text-black ${
              selectedLevel === 'Advanced' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Advanced
          </button>
        </div>
        <div className="flex justify-between">
          <button onClick={handleBack} className="text-gray-500">
            Back
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            disabled={!selectedLevel} // Disable continue if no level is selected
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeLevel;
