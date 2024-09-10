import React from 'react';
import Greeting from './Greeting';

const Onb1 = ({nextStep}) => {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        <p className="text-xl font-semibold text-black mb-4">
          <Greeting />
        </p>
        <p className="text-center text-gray-600 mb-8">
          Let's kick things off by diving into what you do and how we can best meet the needs of your audience!
        </p>
        <button 
          className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300"
          onClick={nextStep}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onb1;
