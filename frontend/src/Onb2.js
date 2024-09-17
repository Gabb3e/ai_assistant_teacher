import React, { useState } from 'react';

const Onb2 = ({ nextStep, previousStep }) => {
  const [selected, setSelected] = useState([]);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const token = localStorage.getItem('token'); // Ensure you get the stored token

  const options = [
    'AI developer',
    'Economics',
    'Law',
    'Engineer',
    'Mathematics',
    'Social Studies',
    'History',
  ];

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else if (selected.length < 3) {
      setSelected([...selected, option]);
    }
  };

  const isSelected = (option) => selected.includes(option);

  const handleCustomInputChange = (e) => {
    if (e.target.value.length <= 50) {
      setCustomSubject(e.target.value);
    }
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && selected.length < 3) {
      setSelected([...selected, customSubject]);
      setCustomSubject('');
      setShowCustomInput(false);
    }
  };

  // This will send the selected subjects to the backend when the user clicks continue
  const saveSubjects = async () => {
    if (selected.length === 0) {
      alert("Please select at least one subject!");
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/users/save-subjects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjects: selected }),
      });
      if (response.ok) {
        console.log("Subjects saved successfully");
        nextStep();
      } else {
        const errorData = await response.json();
        console.error("Failed to save subjects:", errorData);
      }
    } catch (err) {
      console.error("Error saving subjects:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-8">Study Assistant</h1>
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black">What are you currently studying?</h2>
          <p className="text-gray-500 mt-2">Help us customize your experience by selecting the role that best describes you</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {options.map((option, index) => (
            <button
              key={index}
              className={`border border-gray-300 p-4 rounded-lg text-black ${
                isSelected(option) ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => handleSelect(option)}
              disabled={!isSelected(option) && selected.length >= 3}
            >
              {option}
            </button>
          ))}

          {showCustomInput ? (
            <input
              type="text"
              value={customSubject}
              onChange={handleCustomInputChange}
              placeholder="Enter custom subject"
              className="border border-gray-300 p-4 rounded-lg text-black w-full h-full bg-white"
              style={{ maxWidth: '100%' }}
            />
          ) : (
            <button
              className="bg-blue-600 text-white p-4 rounded-lg w-full"
              onClick={() => setShowCustomInput(true)}
              disabled={selected.length >= 3}
              style={{ minWidth: '100%', maxWidth: '100%' }}
            >
              Add your own +
            </button>
          )}
        </div>

        <div className="flex justify-between">
          <button className="text-gray-500" onClick={previousStep}>Back</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={saveSubjects}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onb2;
