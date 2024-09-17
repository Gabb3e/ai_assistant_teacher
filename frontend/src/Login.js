import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Hook to use navigate function
  const [loading, setLoading] = useState(false); // State to show loading
  const [error, setError] = useState(''); // State to handle error messages
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Normalize the email to lowercase
    const updatedValue = name === 'username' ? value.toLowerCase() : value;

    setLoginData({
      ...loginData,
      [name]: updatedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state when submitting
    setError(''); // Reset error state before submission

    try {
      const formData = new URLSearchParams();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await fetch('http://127.0.0.1:8000/user/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        // If login is successful, redirect to /dashboard
        const data = await response.json();
        console.log("This is data", data);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem("first_name", data.first_name);
        const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
        
        if (isFirstLogin) {
          navigate("/onboarding"); // Redirect to the onboarding page
        } else {
          navigate("/dashboard");
         } // Redirect to the dashboard page
      } else {
        // If the credentials are incorrect, show an error
        const errorData = await response.json();
        setError(errorData.detail || "Username and password do not match");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Left side with an illustration or branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center bg-white">
        <div className="p-10">
          <img 
            src="./AI-logo.webp" 
            alt="Login Illustration" 
            className="max-w-sm mx-auto rounded-lg shadow-lg"
          />
          <h2 className="text-4xl font-bold text-gray-800 mt-10 text-center">Welcome Back!</h2>
          <p className="text-lg text-gray-600 mt-4">
            Continue your learning journey and achieve your goals with Study Assistant.
          </p>
        </div>
      </div>

      {/* Right side with the login form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-900 p-8 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
                name="username"
                value={loginData.username}
                onChange={handleChange}
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
                placeholder="Enter your password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
              </div>
              <a href="/forgot" className="text-sm text-indigo-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Don't have an account?{' '}
              <a href="/register" className="text-indigo-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
