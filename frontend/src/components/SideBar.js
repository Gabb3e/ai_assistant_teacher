import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faQuestion, faChartLine } from '@fortawesome/free-solid-svg-icons';

   

const Sidebar = ({ user }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to handle logout
  const HandleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page after logout
  };

  // Ensure user is available before rendering the sidebar
  if (user) {
    return (
      <aside className="bg-gray-900 p-6 min-h-screen shadow-lg">
        <div className="mb-10">
          <img
            src="data:image/jpeg;base64,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"
            alt="User Avatar"
            className="rounded-full w-36 h-36 mb-4 shadow-lg text-center mx-auto"
          />
          <h3 className="text-xl font-bold text-white">{user.first_name} {user.last_name}</h3>
          <p className="text-sm text-white text-center">{user.email}</p>
        </div>
        <nav>
          <ul>
            <li className="mb-6">
              <a href="/" className="text-xl font-semibold text-white hover:text-blue-300">
              <FontAwesomeIcon icon={faHome} className="text-white mr-3" />
                Home
              </a>
            </li>
            <li className="mb-6">
              <a href="/SubjectSelection" className="text-xl font-semibold text-white hover:text-blue-300">
              <FontAwesomeIcon icon={faQuestion} className="text-white mr-3 font-extrabold" />
                Quizz
              </a>
            </li>
            <li className="mb-6">
              <a href="/task-list" className="text-xl font-semibold text-white hover:text-blue-300">
              <FontAwesomeIcon icon={faChartLine} className="text-white mr-3" />
                Progress
              </a>
            </li>
            <li className="mb-6">
              <a href="/tracking" className="text-xl font-semibold text-white hover:text-blue-300">
              <FontAwesomeIcon icon={faUser} className="text-white mr-3" />
                Profile
              </a>
            </li>
            <li className="mb-6 mt-14">
              <a href="/login" onClick={HandleLogout} className="text-xl font-semibold text-white hover:text-red-300">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-white mr-3" />
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    );}
  };

  export default Sidebar;
