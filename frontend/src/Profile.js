import React, { useState } from 'react';

const Sidebar = ({ user }) => {
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
            <a href="/quizzes" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Quizzes
            </a>
          </li>
          <li className="mb-4">
            <a href="/progress" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Progress
            </a>
          </li>
          <li className="mb-4">
            <a href="/profile" className="text-lg font-semibold text-blue-600">
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
  );
};

const Profile = () => {
  // Mock user data for now
  const user = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    profile_picture: 'https://via.placeholder.com/150',
  };

  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    profile_picture: user.profile_picture,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Toggle between view and edit mode
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
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
            <div className="flex items-center">
              <img
                src={profileData.profile_picture}
                alt="User Avatar"
                className="rounded-full w-14 h-14 mr-4"
              />
              {editing && (
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Change Profile Picture
                  </label>
                  <input
                    type="file"
                    className="mt-1 text-xs"
                    onChange={(e) => console.log('Profile picture selected', e.target.files[0])} // Placeholder
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  disabled={!editing}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-2 border ${editing ? 'border-gray-300' : 'border-transparent'} rounded-md text-sm`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  disabled={!editing}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-2 border ${editing ? 'border-gray-300' : 'border-transparent'} rounded-md text-sm`}
                />
              </div>
            </div>

            {editing ? (
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleEditToggle}
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
                onClick={handleEditToggle}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 mt-4"
              >
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => console.log('Password saved')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700"
              >
                Save Password
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
