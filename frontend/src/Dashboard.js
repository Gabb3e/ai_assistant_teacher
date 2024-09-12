import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import LoginStreak from "./components/LoginStreak";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initialize user state as null
  const [likedSubjects, setLikedSubjects] = useState([]); // Initialize liked subjects state
  const [newSubject, setNewSubject] = useState(""); // State for new subject input
  const [error, setError] = useState(null); // Error handling state
  const [success, setSuccess] = useState(null); // Success state
  const [token, setToken] = useState(null); // State for storing token
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Function to fetch liked subjects
  const fetchLikedSubjects = async (userId) => {
    try {
      const likedSubjectsResponse = await fetch(
        `http://127.0.0.1:8000/users/${userId}/liked-subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
            Authorization: `Bearer ${storedToken}`,
            accept: "application/json",
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
    return (
      <div className="text-xl text-green-700 animate-spin">Loading......</div>
    );
  }

  const goToTopicSelection = () => {
    navigate("/TopicSelection"); // Navigate to the TopicSelection page
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/${user.id}/add-subject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subject_name: newSubject }), // Send the subject name
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Subject "${data.name}" added successfully!`);
        setError(null);
        setNewSubject(""); // Clear input after success
        fetchLikedSubjects(user.id); // Refresh liked subjects after adding new one
        // Automatically close the modal after success
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(null); // Clear success message when modal is closed
        }, 1000); // Close after 1 second to let user see success message briefly
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

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear error message when modal is closed
    setSuccess(null); // Clear success message when modal is closed
  };

  const startQuiz = (subject) => {
    navigate(`/quiz/${subject}`);
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Hello, {user.first_name}!
            </h2>
            <p className="text-lg text-gray-500 mt-2">
              Here’s a quick overview of your progress.
            </p>
          </div>
          <div>
            {/* Button to open modal */}
            <button
              onClick={() => setIsModalOpen(true)} // Show modal when clicked
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Add New Subject
            </button>
          </div>
        </header>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4">Add New Subject</h3>

              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter new subject"
                className="border p-2 rounded w-full mb-4"
              />

              {/* Display error or success messages */}
              {error && (
                <p className="text-red-700 mt-2 font-bold pb-3">{error}</p>
              )}
              {success && (
                <p className="text-green-700 mt-2 font-bold pb-3">{success}</p>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleAddSubject}
                  className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Subject
                </button>
                <button
                  onClick={closeModal} // Close modal
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl pl-22">
          {likedSubjects.length > 0 ? (
            likedSubjects.map((subject, index) => {
              const quizButtonColors = [
                "bg-cyan-500 hover:bg-blue-700 text-white",
                "bg-sky-500 hover:bg-blue-700 text-white",
                "bg-blue-500 hover:bg-blue-700 text-white",
                "bg-blue-600 hover:bg-blue-700 text-white",
              ]; //Quick fix for the grids, if adding something on the right side of the screen, the grid will be broken.

              // Calculate the button color using the index
              const quizButtonColor =
                quizButtonColors[index % quizButtonColors.length];

              return (
                <div
                  key={subject.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-slate-900 rounded-lg px-2">
                      {subject.name}
                    </h3>
                    <span className="text-gray-400 text-sm"></span>
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={() =>
                        navigate("/TopicSelection", {
                          state: { subject: subject.name },
                        })
                      } // Pass subject to TopicSelection
                      className={`w-full py-3 rounded-lg transition ${quizButtonColor}`} // Apply dynamic color here
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
              );
            })
          ) : (
            <p className="text-lg text-gray-500">
              No subjects liked yet. Start by adding a new subject.
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <LoginStreak user={user} />

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Quiz Progress
            </h3>
            <p className="text-lg text-gray-500">Maths Quiz</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">80%</p>
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mt-4">
              <p className="text-gray-500">Progress Graph Placeholder</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
