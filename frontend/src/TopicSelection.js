import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './AppNavbar';

const TopicSelection = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);

  const handleContinue = () => {
    navigate('/QuestionCount');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setIsCustomInputVisible(false);
  };

  const handleAddCustomTopic = () => {
    setIsCustomInputVisible(true);
    setSelectedTopic('custom');
  };

  const handleCustomTopicChange = (e) => {
    setCustomTopic(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Navbar />
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Step: 1 of 3</span>
          </div>
          <div className="flex space-x-2 w-full mt-2">
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            Which area of <span className="text-blue-600">Python</span> would you like to focus on?
          </h2>
          <p className="text-gray-500 mt-2">
            This helps us better tailor our questions to fit your topics
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleTopicSelect('Python Basics')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Python Basics' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Python Basics
          </button>
          <button
            onClick={() => handleTopicSelect('Control Structures')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Control Structures' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Control Structures
          </button>
          <button
            onClick={() => handleTopicSelect('Functions and Modules')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Functions and Modules' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Functions and Modules
          </button>
          <button
            onClick={() => handleTopicSelect('Data Structures')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Data Structures' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Data Structures
          </button>
          <button
            onClick={() => handleTopicSelect('File Handling')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'File Handling' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            File Handling
          </button>
          <button
            onClick={() => handleTopicSelect('Error Handling and Exceptions')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Error Handling and Exceptions' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Error Handling and Exceptions
          </button>
          <button
            onClick={() => handleTopicSelect('Object-Oriented Programming')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedTopic === 'Object-Oriented Programming' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Object-Oriented Programming
          </button>

          {/* Add Custom Topic */}
          {!isCustomInputVisible ? (
            <button
              onClick={handleAddCustomTopic}
              className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
                selectedTopic === 'custom' ? 'bg-blue-600 text-white' : ''
              }`}
            >
              Add your own +
            </button>
          ) : (
            <input
              type="text"
              value={customTopic}
              onChange={handleCustomTopicChange}
              className="border border-gray-300 p-4 rounded-lg text-black"
              placeholder="Enter your custom topic"
            />
          )}
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
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
