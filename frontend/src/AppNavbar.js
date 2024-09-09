import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg mb-24 mt-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link
            to="/dashboard"
            className="text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-300"
          >
            Quizzes
          </Link>
          <Link
            to="/progress"
            className="text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-300"
          >
            Progress
          </Link>
          <Link
            to="/profile"
            className="text-gray-800 text-lg font-semibold hover:text-blue-600 transition duration-300"
          >
            Profile
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ml-6"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
