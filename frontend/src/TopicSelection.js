import React from 'react';

const TopicSelection = () => {
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
          <h2 className="text-2xl font-semibold text-black">
            Which area of <span className="text-blue-600">Python</span> would you like to focus on?
          </h2>
          <p className="text-gray-500 mt-2">
            This helps us better tailor our questions to fit your topics
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="border border-gray-300 p-4 rounded-lg text-black">Python Basics</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Control Structures</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Functions and Modules</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Data Structures</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">File Handling</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Error Handling and Exceptions</button>
          <button className="border border-gray-300 p-4 rounded-lg text-black">Object-Oriented Programming</button>
          <button className="bg-blue-600 text-white p-4 rounded-lg">Add your own +</button>
        </div>
        <div className="flex justify-between">
          <button className="text-gray-500">Back</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg">Continue →</button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
