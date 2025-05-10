import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onb4 = ({ previousStep }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const completeOnboarding = () => {
    localStorage.setItem('isFirstLogin', 'false');
    navigate('/dashboard');
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        {/* Step 4 of 4 Alignment Fix */}
        <div className="flex items-center mb-8">
          <span className="text-gray-600 mr-4 whitespace-nowrap">Step: 4 of 4</span>
          <div className="flex-grow flex space-x-2">
            <div className="h-1 bg-blue-600 rounded-full w-full"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">What are your main goals for using Study Assistant?</h2>
          <p className="text-gray-500 mt-2">This helps us better customize your experience</p>
        </div>

        {/* Options with Blue Background when Selected */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['Prepare for exams', 'Improve grades', 'Learn new topics', 'Stay Organized', 'Other'].map((option) => (
            <button
              key={option}
              className={`border border-gray-300 p-4 rounded-lg text-black ${
                selectedOption === option ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button className="text-gray-500" onClick={previousStep}>
            Back
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            onClick={completeOnboarding}
            disabled={!selectedOption} // Disable if no option is selected
          >
            Finish →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onb4;
