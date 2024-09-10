import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onb4 = ({previousStep}) => {
  const navigate = useNavigate();

  const completeOnboarding = () => {
    localStorage.setItem('isFirstLogin', 'false');
    navigate('/dashboard');
  }
 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">Step: 4 of 4</span>
          <div className="flex space-x-2 w-full ml-4">
            <div className="h-1 bg-blue-600 rounded-full w-full"></div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">What are your main goals for using Study Assistant?</h2>
          <p className="text-gray-500 mt-2">This helps us better customize your experience</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="border border-gray-300 p-4 rounded-lg text-black">Prepare for exams</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Improve grades</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Learn new topics</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Stay Organized</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Other</button>
        </div>
        <div className="flex justify-between">
          <button className="text-gray-500" onClick={previousStep}>Back</button>
          <button 
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            onClick={completeOnboarding}
          >
            Finish →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onb4;
