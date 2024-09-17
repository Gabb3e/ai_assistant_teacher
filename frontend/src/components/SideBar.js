import React from 'react';

const Sidebar = ({ user }) => {
  return (
    <aside className="bg-gray-900 p-6 min-h-screen shadow-lg">
      <div className="mb-10">
        <img
          // Placeholder image for user avatar
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          className="rounded-full w-36 h-36 mb-4 shadow-lg"
        />
        <h3 className="text-xl font-bold text-white">{user.first_name} {user.last_name}</h3>
        <p className="text-sm text-white">{user.email}</p>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="/" className="text-xl font-semibold text-white hover:text-blue-600">
              Home
            </a>
          </li>
          <li className="mb-4">
            <a href="/SubjectSelection" className="text-xl font-semibold text-white hover:text-blue-600">
              Quizzes
            </a>
          </li>
          <li className="mb-4">
            <a href="/task-list" className="text-xl font-semibold text-white hover:text-blue-600">
              Progress
            </a>
          </li>
          <li className="mb-4">
            <a href="/profile" className="text-xl font-semibold text-white hover:text-blue-600">
              Profile
            </a>
          </li>
          <li className="mb-4">
            <a href="/login" className="text-xl font-semibold text-white hover:text-blue-600">
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;