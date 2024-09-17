import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './AppNavbar';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);

  const handleContinue = () => {
    // Pass selectedSubject when navigating to TopicSelection
    navigate('/TopicSelection', { state: { subject: selectedSubject } });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTopicSelect = (topic) => {
    setSelectedSubject(topic);
    setIsCustomInputVisible(false);
  };

  const handleAddCustomSubject = () => {
    setIsCustomInputVisible(true);
    setSelectedSubject('custom');
  };

  const handleCustomSubjectChange = (e) => {
    setCustomSubject(e.target.value);
    setSelectedSubject(e.target.value); // Set the custom subject
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Navbar />
      <h1 className="text-4xl font-bold text-black mb-8">Quiz</h1>
      <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-center items-center mb-2">
          <span className="text-gray-600">Step: 1 of 4</span>
        </div>
        <div className="flex space-x-2 w-full justify-center">
          <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
          <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
          <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
          <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
        </div>
      </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            What <span className="text-blue-600">Subject</span> do you want to take a quiz on?
          </h2>
          <p className="text-gray-500 mt-2">
            This helps us better tailor our questions to fit your subject
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleTopicSelect('Mathematics')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Mathematics' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Mathematics
          </button>
          <button
            onClick={() => handleTopicSelect('Programming')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Programming' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Programming
          </button>
          <button
            onClick={() => handleTopicSelect('Economics')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Economics' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Economics
          </button>
          <button
            onClick={() => handleTopicSelect('Law')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Law' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Law
          </button>
          <button
            onClick={() => handleTopicSelect('Social Studies')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Social Studies' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Social Studies
          </button>
          <button
            onClick={() => handleTopicSelect('Science')}
            className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
              selectedSubject === 'Science' ? 'bg-blue-600 text-white' : ''
            }`}
          >
            Science
          </button>

          {/* Add Custom Topic */}
          {!isCustomInputVisible ? (
            <button
              onClick={handleAddCustomSubject}
              className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300 ${
                selectedSubject === 'custom' ? 'bg-blue-600 text-white' : ''
              }`}
            >
              Add your own +
            </button>
          ) : (
            <input
              type="text"
              value={customSubject}
              onChange={handleCustomSubjectChange}
              className="border border-gray-300 p-4 rounded-lg text-black"
              placeholder="Enter your custom subject"
            />
          )}
        </div>
        <div className="flex justify-between">
          <button onClick={handleBack} className="bg-red-300 text-white py-2 px-9 rounded-lg">
            Back
          </button>
          <button onClick={handleContinue} className="bg-blue-600 text-white py-2 px-6 rounded-lg">
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
