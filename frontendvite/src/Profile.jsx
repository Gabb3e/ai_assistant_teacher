import React, { useState, useEffect } from 'react';
import Sidebar from './components/SideBar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null); // Initialize user state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set user data
          setProfileData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
          });
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('email', profileData.email);

    if (!user || !user.id) {
      setError('User ID not found. Please try refreshing the page.');
      return;
    }

    try {
      // Update the user profile
      const response = await fetch(`http://localhost:8000/users/${user.id}/update-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Fetch the updated user data after successful update
        const updatedUser = await fetch('http://localhost:8000/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (updatedUser.ok) {
          const userData = await updatedUser.json();
          setUser(userData);
          setEditing(false);
        } else {
          setError('Failed to fetch updated user data');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Show a loading message while fetching user data
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar with fetched user data */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
        </header>

        {/* Profile Information */}
        <section className="bg-white p-5 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!editing}
                />
              </div>
            </div>

            {editing ? (
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 mt-4"
              >
                Edit Profile
                </button>
        )}

        {/* Replace the error rendering with a specific message */}
        {error && <p className="text-red-500 mt-4">An error occurred while updating your profile. Please try again later.</p>}
      </div>
    </section>
  </main>
</div>
);
};

export default Profile;