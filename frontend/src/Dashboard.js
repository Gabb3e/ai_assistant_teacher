import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
      <p className="text-gray-600 mb-12">
        Welcome back! Here's a summary of your recent activities and progress.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Subject Sections */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 opacity-50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Maths</h3>
              <span className="text-sm text-gray-300">Monthly</span>
            </div>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Take a quiz!</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Learning Path</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">AI Teacher</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-700 opacity-50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">History</h3>
              <span className="text-sm text-gray-300">Monthly</span>
            </div>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Take a quiz!</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Learning Path</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">AI Teacher</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 opacity-50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Economics</h3>
              <span className="text-sm text-gray-300">Monthly</span>
            </div>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Take a quiz!</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Learning Path</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">AI Teacher</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Streak Section */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-purple-700 opacity-50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Login Streak</h3>
              <span className="text-sm text-gray-300">Monthly</span>
            </div>
            <p className="text-4xl font-bold text-white mb-4">23</p>
            <p className="text-gray-300">Total days logged in consecutively</p>

            <div className="mt-8 space-y-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Day 1: Logged in</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Day 2: Logged in</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center justify-between backdrop-filter backdrop-blur-lg">
                <span className="text-white font-semibold">Day 3: Logged in</span>
                <span className="text-white font-bold">{'>'}</span>
              </div>
              {/* Add more days as needed */}
            </div>
          </div>
        </div>

        {/* Pipeline Value Section */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500 to-yellow-700 opacity-50"></div>
          <div className="relative p-6 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Pipeline Value</h3>
              <span className="text-sm text-gray-300">Monthly</span>
            </div>
            <p className="text-4xl font-bold text-white mb-4">$50,000</p>
            <p className="text-gray-300">Total booked: 5 meetings</p>

            <div className="mt-8">
              <div className="w-full h-32 bg-white bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-lg">
                {/* Graph placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
