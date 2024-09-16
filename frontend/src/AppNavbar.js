import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-lg fixed top-0 w-full z-50">
      <div className="text-2xl font-bold text-white mx-5 mt-5">Study Assistant</div>
      <div className="container mx-auto pb-3 flex justify-center items-center">
        <div className="flex space-x-6">
          <Link
            to="/dashboard"
            className="text-white text-lg font-semibold hover:text-blue-400 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-white text-lg font-semibold hover:text-blue-400 transition duration-300"
          >
            Quizzes
          </Link>
          <Link
            to="/progress"
            className="text-white text-lg font-semibold hover:text-blue-400 transition duration-300"
          >
            Progress
          </Link>
          <Link
            to="/profile"
            className="text-white text-lg font-semibold hover:text-blue-400 transition duration-300"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
