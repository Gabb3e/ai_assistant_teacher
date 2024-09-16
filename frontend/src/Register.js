import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });

  const [loading, setLoading] = useState(false); // State to show loading
  const [error, setError] = useState({}); // State to handle error messages for individual fields
  const [success, setSuccess] = useState(''); // State to handle success messages
  const navigate = useNavigate(); // Hook to use navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert email to lowercase for normalization
    const updatedValue = name === 'email' ? value.toLowerCase() : value;

    setFormData({
      ...formData,
      [name]: updatedValue
    });
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!formData.first_name.trim()) {
      validationErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      validationErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email address is invalid';
    }

    if (!formData.gender) {
      validationErrors.gender = 'Gender is required';
    }

    if (!formData.age) {
      validationErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age <= 0) {
      validationErrors.age = 'Age must be a valid number';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({}); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      setError(formErrors);
      return;
    }

    const requestData = {
      ...formData,
      age: Number(formData.age)  // Ensure age is a number
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
        localStorage.setItem("isFirstLogin", "true");
        setSuccess("Registration successful!");
        navigate("/login");  // Redirect to the login page
      } else {
        const errorData = await response.json();
        setError({ general: errorData.detail || "Registration failed" });
      }
    } catch (error) {
      setError({ general: "An error occurred during registration." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r bg-white">
      {/* Left side with an illustration or branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-start bg-white mt-36">
        <div className=" bg-white">
          <img
            src="./AI-logo.webp"
            alt="Registration Illustration"
            className="max-w-sm mx-auto"
          />
          <h2 className="text-4xl font-bold text-gray-800 mt-10 text-center">
            Join the Community
          </h2>
        </div>
      </div>

      {/* Right side with the registration form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-900 p-8 lg:p-16">
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
              {error.first_name && <p className="text-red-500 text-sm">{error.first_name}</p>}
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="last_name"
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
              {error.last_name && <p className="text-red-500 text-sm">{error.last_name}</p>}
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
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
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
              {error.gender && <p className="text-red-500 text-sm">{error.gender}</p>}
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
              {error.age && <p className="text-red-500 text-sm">{error.age}</p>}
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
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Confirm your password"
                name="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
              {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
            </div>

            {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
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
