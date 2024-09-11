import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/SideBar';
import LoginStreak from './components/LoginStreak';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initialize user state as null
  const [likedSubjects, setLikedSubjects] = useState([]); // Initialize liked subjects state
  const [newSubject, setNewSubject] = useState(''); // State for new subject input
  const [error, setError] = useState(null); // Error handling state
  const [success, setSuccess] = useState(null); // Success state
  const [token, setToken] = useState(null); // State for storing token


  // Function to fetch liked subjects
  const fetchLikedSubjects = async (userId) => {
    try {
      const likedSubjectsResponse = await fetch(`http://127.0.0.1:8000/users/${userId}/liked-subjects`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (likedSubjectsResponse.ok) {
        const likedSubjectsData = await likedSubjectsResponse.json();
        setLikedSubjects(likedSubjectsData); // Set liked subjects
      } else {
        const errorData = await likedSubjectsResponse.json();
        setError(errorData.detail || "Failed to fetch liked subjects");
      }
    } catch (error) {
      setError("An error occurred while fetching liked subjects.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token"); // Fetch token from localStorage
      setToken(storedToken); // Store the token in the state
      if (!storedToken) {
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          fetchLikedSubjects(data.id); // Fetch liked subjects after fetching user data
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch user data");
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div className='text-xl text-green-700 animate-spin'>Loading......</div>;
  }

  const goToTopicSelection = () => {
    navigate('/TopicSelection'); // Navigate to the TopicSelection page
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/add-subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ subject_name: newSubject }), // Send the subject name
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Subject "${data.name}" added successfully!`);
        setError(null);
        setNewSubject(''); // Clear input after success
        fetchLikedSubjects(user.id); // Refresh liked subjects after adding new one
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to add subject.");
        setSuccess(null);
      }
    } catch (err) {
      setError("An error occurred while adding the subject.");
      setSuccess(null);
    }
  };

  const startQuiz = (subject) => {
    navigate(`/quiz/${subject}`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Hello, {user.first_name}!</h2>
            <p className="text-lg text-gray-500 mt-2">Here’s a quick overview of your progress.</p>
          </div>
          {/* Input for new subject */}
          <div>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter new subject"
              className="border p-2 rounded mb-2"
            />

            <button
              onClick={handleAddSubject} // Call the add subject handler
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Add New Subject
            </button>

            {/* Display error or success messages */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {likedSubjects.length > 0 ? (
            likedSubjects.map((subject) => (
              <div key={subject.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-blue-600">{subject.name}</h3>
                  <span className="text-gray-400 text-sm">Monthly</span>
                </div>
                <div className="space-y-4">
                <button
                    onClick={() => navigate('/TopicSelection', { state: { subject: subject.name } })} // Pass subject to TopicSelection
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Take a quiz!
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition">
                    Learning Path
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition">
                    AI Teacher
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No subjects liked yet. Start by adding a new subject.</p>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <LoginStreak user={user} />

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Quiz Progress</h3>
            <p className="text-lg text-gray-500">Maths Quiz</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">80%</p>
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mt-4">
              <p className="text-gray-500">Progress Graph Placeholder</p>
            </div>
          </div>
        </section>
      </main>

      <aside className="bg-white p-8 min-h-screen shadow-lg w-64">
        <h3 className="text-xl font-bold text-gray-700 mb-8">Calendar</h3>
        <ul className="space-y-8">
          <li>
            <p className="text-sm text-gray-500">Oct 20, 2024</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-700">10:00 AM</p>
                <p className="text-gray-500">Math test</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">1:20 PM</p>
                <p className="text-gray-500">History test</p>
              </div>
            </div>
          </li>
          <li>
            <p className="text-sm text-gray-500">Oct 21, 2024</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-700">10:00 AM</p>
                <p className="text-gray-500">Sleep App</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">1:20 PM</p>
                <p className="text-gray-500">Economics test</p>
              </div>
            </div>
          </li>
          <li>
            <p className="text-sm text-gray-500">Oct 22, 2024</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-700">10:00 AM</p>
                <p className="text-gray-500">Meet Up</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">11:00 AM</p>
                <p className="text-gray-500">History assignment</p>
              </div>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Dashboard;
