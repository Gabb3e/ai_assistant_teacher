import React from 'react';

const QuestionPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
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
          <button className="border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300">
            O(1)
          </button>
          <button className="border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300">
            O(n)
          </button>
          <button className="border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300">
            O(log n)
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button className="text-gray-500">Back</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
