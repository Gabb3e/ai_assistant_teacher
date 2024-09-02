import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/TopicSelection');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h2>
      <p className="text-lg text-gray-600 mb-12">
        Welcome back! Here’s a quick overview of your progress.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Subject Section */}
        <div className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-blue-500 p-6 text-white">
            <h3 className="text-3xl font-bold">Maths</h3>
            <p className="text-sm">Monthly</p>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={startQuiz}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Take a quiz!
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              Learning Path
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              AI Teacher
            </button>
          </div>
        </div>

        <div className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-green-500 p-6 text-white">
            <h3 className="text-3xl font-bold">History</h3>
            <p className="text-sm">Monthly</p>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={startQuiz}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Take a quiz!
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              Learning Path
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              AI Teacher
            </button>
          </div>
        </div>

        <div className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-red-500 p-6 text-white">
            <h3 className="text-3xl font-bold">Economics</h3>
            <p className="text-sm">Monthly</p>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={startQuiz}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Take a quiz!
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              Learning Path
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
              AI Teacher
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Streak Section */}
        <div className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-purple-500 p-6 text-white">
            <h3 className="text-3xl font-bold">Login Streak</h3>
            <p className="text-lg font-bold">23 days</p>
            <p className="text-sm">Total days logged in consecutively</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Day 1: Logged in</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Day 2: Logged in</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Day 3: Logged in</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
          </div>
        </div>

        {/* Pipeline Value Section */}
        <div className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-yellow-500 p-6 text-white">
            <h3 className="text-3xl font-bold">Pipeline Value</h3>
            <p className="text-lg font-bold">$50,000</p>
            <p className="text-sm">Total booked: 5 meetings</p>
          </div>
          <div className="p-6">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
