import React from 'react';


const Onb2 = ({nextStep, previousStep}) => {


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-gray-600">Step: 2 of 4</span>
          <div className="flex space-x-2 w-full ml-4">
            <div className="h-1 bg-blue-600 rounded-full w-1/3"></div>
            <div className="h-1 bg-blue-600 rounded-full w-1/3"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/3"></div>
            <div className="h-1 bg-gray-300 rounded-full w-1/3"></div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">What are you currently studying?</h2>
          <p className="text-gray-500 mt-2">Help us customize your experience by selecting the role that best describes you</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="border border-gray-300 p-4 rounded-lg text-black">AI developer</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Economics</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Law</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Engineer</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Mathematics</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Social Studies</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">History</button>
          <button className="bg-blue-600 text-white p-4 rounded-lg">Add your own +</button>
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

export default Onb2;
