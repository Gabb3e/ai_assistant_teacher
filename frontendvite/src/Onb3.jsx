import React from 'react';

const Onb3 = ({ nextStep, previousStep }) => {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        {/* Fix for the Step: 3 of 4 alignment */}
        <div className="flex items-center mb-8">
          <span className="text-gray-600 mr-4 whitespace-nowrap">Step: 3 of 4</span>
          <div className="flex-grow flex space-x-2">
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/4"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">How often do you want to study?</h2>
          <p className="text-gray-500 mt-2">This helps us track progress to reach your goals</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <select className="border border-gray-300 p-4 rounded-lg text-black">
            <option>1 day / Week</option>
            <option>2 days / Week</option>
            <option>3 days / Week</option>
            <option>4 days / Week</option>
            <option>5 days / Week</option>
            <option>6 days / Week</option>
            <option>7 days / Week</option>
          </select>
        </div>
        
        <div className="flex justify-between">
          <button className="text-gray-500" onClick={previousStep}>Back</button>
          <button 
            className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            onClick={nextStep}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onb3;
