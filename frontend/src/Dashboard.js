import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
      <p className="text-gray-600 mb-8">
        Lorem ipsum dolor sit amet consectetur. Dignissim massa enim risus.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Subject Sections */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Maths</h3>
            <span className="text-sm text-gray-500">Monthly</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Take a quiz!</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Learning Path</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Teacher</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">History</h3>
            <span className="text-sm text-gray-500">Monthly</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Take a quiz!</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Learning Path</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Teacher</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Economics</h3>
            <span className="text-sm text-gray-500">Monthly</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Take a quiz!</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Learning Path</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Teacher</span>
              <span className="text-gray-400">{'>'}</span>
            </div>
          </div>
        </div>

        {/* Login Streak Section */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Login Streak</h3>
            <span className="text-sm text-gray-500">Monthly</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">23</p>
          <p className="text-gray-500">Total days logged in consecutively</p>

          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Day 1: Logged in</span>
                <span className="text-gray-400">{'>'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Day 2: Logged in</span>
                <span className="text-gray-400">{'>'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Day 3: Logged in</span>
                <span className="text-gray-400">{'>'}</span>
              </div>
              {/* Add more days as needed */}
            </div>
          </div>
        </div>

        {/* Pipeline Value Section */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pipeline Value</h3>
            <span className="text-sm text-gray-500">Monthly</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">$50,000</p>
          <p className="text-gray-500">Total booked: 5 meetings</p>

          <div className="mt-8">
            <div className="w-full h-32 bg-gray-100 rounded-lg">
              {/* Graph placeholder */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
