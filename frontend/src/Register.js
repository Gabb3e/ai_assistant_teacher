import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    password: "",
    gender: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [loading, setLoading] = useState(false); // State to show loading
  const [error, setError] = useState(''); // State to handle error messages
  const [success, setSuccess] = useState(''); // State to handle success messages
  const navigate = useNavigate(); // Hook to use navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    setError(''); // Reset error message
    setSuccess(''); // Reset success message
    const age = Number(formData.age);

    const requestData = {
      ...formData,
      age: age  // Ensure age is a number
    };
   
    try {
      const response = await fetch('http://127.0.0.1:8000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Convert form data to JSON
      });
  
     
      if (response.ok) {
        // If registration is successful, redirect to /login
        navigate("/login");  // Redirect to the login page
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred during registration.");
  };
};
    


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
          <h2 className="text-4xl font-bold text-gray-800 mt-10">
            Join the Community
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Access personalized learning paths, track your progress, and achieve
            your goals with Study Assistant.
          </p>
        </div>
      </div>

      {/* Right side with the registration form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-100 p-8 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="first_name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your first name"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastname"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your last name"
                onChange={handleChange}
                name="last_name"
                value={formData.last_name}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
                onChange={handleChange}
                name="email"
                value={formData.email}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                onChange={handleChange}
                name="gender"
                value={formData.gender}
                required
              >
                <option value="">Select your gender</option>
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="age"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your age"
                name="age"
                onChange={handleChange}
                value={formData.age} 
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Create a password"
                onChange={handleChange}
                value={formData.password}
                name="password"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
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
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
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
