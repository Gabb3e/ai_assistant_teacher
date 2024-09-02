import React from 'react';

const QuizResults = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Quiz Results</h1>
      <div className="w-full max-w-3xl mx-auto">
        {/* Summary Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">
            You scored 7 out of 10!
          </h2>
          <p className="text-gray-500 mt-2">
            Here's a breakdown of your answers:
          </p>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-2">Question 1:</h3>
            <p className="text-gray-700 mb-4">
              What is the time complexity of accessing an element in a hash table?
            </p>
            <p className="text-green-600 font-bold">Your answer: O(1) - Correct!</p>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-2">Question 2:</h3>
            <p className="text-gray-700 mb-4">
              What is the time complexity of binary search?
            </p>
            <p className="text-red-600 font-bold">Your answer: O(n) - Incorrect</p>
            <p className="text-gray-500">Correct answer: O(log n)</p>
          </div>

          {/* Repeat this block for all questions */}
          {/* More question blocks here */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button className="text-gray-500">Retake Quiz</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg">Review Answers →</button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
