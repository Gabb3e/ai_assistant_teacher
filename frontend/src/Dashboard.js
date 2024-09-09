import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'; 

const Sidebar = ({user}) => {
  
  if (user)
  {
  return (
    <aside className="bg-white p-8 min-h-screen shadow-lg">
      <div className="mb-10">
        <img
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          className="rounded-full w-20 h-20 mb-4"
        />
        <h3 className="text-xl font-bold">{user.first_name} {user.last_name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="/" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Home
            </a>
          </li>
          <li className="mb-4">
            <a href="/analytics" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Quizzes
            </a>
          </li>
          <li className="mb-4">
            <a href="/task-list" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Progress
            </a>
          </li>
          <li className="mb-4">
            <a href="/tracking" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Profile
            </a>
          </li>
          <li className="mb-4">
            <a href="/login" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );}
};

const Dashboard = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const startQuiz = (subject) => {
    navigate(`/quiz/${subject}`);
  };

  const goToTopicSelection = () => {
    navigate('/TopicSelection'); // Navigate to the TopicSelection page
  };

  const [user, setUser] = useState(null);  // Initialize user state as null
  const [error, setError] = useState(null);  // Error handling state
 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");  // Ensure you're using the correct token key
      if (!token) {
        console.log(token);
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/me", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,  // Pass the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("This is the response", data);
          setUser(data);  // Set the user data
          navigate("/dashboard");  // Redirect to login if no token is found
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch user data");
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUser();
  }, [navigate]);  // Add `navigate` to dependency array to avoid stale closures

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

if (user)
{  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar user={user}/>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Hello, {user.first_name}!</h2>
            <p className="text-lg text-gray-500 mt-2">Here’s a quick overview of your progress.</p>
          </div>
          <button
            onClick={goToTopicSelection} // onClick handler for navigation to TopicSelection
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Add New Topic
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-blue-600">Maths</h3>
              <span className="text-gray-400 text-sm">Monthly</span>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => startQuiz('maths')}
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

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-green-600">History</h3>
              <span className="text-gray-400 text-sm">Monthly</span>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => startQuiz('history')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
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

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-red-600">Economics</h3>
              <span className="text-gray-400 text-sm">Monthly</span>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => startQuiz('economics')}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
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
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Login Streak</h3>
            <p className="text-3xl font-bold text-purple-600">23 days</p>
            <p className="text-gray-500 mt-2">Total days logged in consecutively</p>
            <ul className="mt-4 space-y-2">
              <li className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Day 1: Logged in</span>
                <span className="text-gray-500">{'>'}</span>
              </li>
              <li className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Day 2: Logged in</span>
                <span className="text-gray-500">{'>'}</span>
              </li>
              <li className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Day 3: Logged in</span>
                <span className="text-gray-500">{'>'}</span>
              </li>
            </ul>
          </div>

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
  );}
};

export default Dashboard;
