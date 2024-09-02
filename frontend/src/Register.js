import React from 'react';

const Register = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Left side with an illustration or branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center bg-white">
        <div className="p-10">
          <img 
            src="https://via.placeholder.com/400" 
            alt="Registration Illustration" 
            className="max-w-sm mx-auto"
          />
          <h2 className="text-4xl font-bold text-gray-800 mt-10">Join the Community</h2>
          <p className="text-lg text-gray-600 mt-4">
            Access personalized learning paths, track your progress, and achieve your goals with Study Assistant.
          </p>
        </div>
      </div>

      {/* Right side with the registration form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-100 p-8 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Create Your Account</h2>
          <form>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Register
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Already have an account?{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
