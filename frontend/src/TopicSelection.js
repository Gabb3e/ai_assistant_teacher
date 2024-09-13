import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './AppNavbar';
import landingPage from './LandingPage';

const TopicSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject || 'Unknown Subject'; // Get subject from location
  const [topics, setTopics] = useState([]); // State to hold topics from API
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState(''); // State to hold custom topic
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false); // Show/hide custom input
  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch topics from the API based on the selected subject
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:8000/generate-topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject }), // Send the selected subject
        });

        if (response.ok) {
          const data = await response.json();
          const topicsFromAPI = data.topics; 
          setTopics(topicsFromAPI);
        } else {
          console.error('Failed to fetch topics');
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subject]);

  const handleContinue = () => {
    // Navigate to the next step, passing the selected topic (or custom topic)
    const topicToUse = customTopic || selectedTopic;
    navigate('/QuestionCount', { state: { subject, topic: topicToUse } });
  };

  const handleBack = () => {
    navigate('/SubjectSelection');
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCustomTopic(''); // Clear custom topic if user selects a predefined topic
  };

  const handleAddCustomTopic = () => {
    setIsCustomInputVisible(true); // Show input field for custom topic
    setSelectedTopic(''); // Clear selected topic
  };

  const handleCustomTopicChange = (e) => {
    setCustomTopic(e.target.value);
    setSelectedTopic(''); // Clear selected topic if user enters a custom topic
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Navbar />
      <h1 className="text-4xl font-bold text-black mb-8">Quiz</h1>
      <div className="w-full max-w-2xl mx-auto">
        {loading ? (
          <p><landingPage/></p> // Show loading state while fetching data
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Step: 2 of 3</span>
              </div>
              <div className="flex space-x-2 w-full mt-2">
                <div className="h-1 bg-blue-600 rounded-full w-1/2"></div>
                <div className="h-1 bg-gray-300 rounded-full w-1/4"></div>
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-black">
                Which area of <span className="text-blue-600">{subject}</span> would you like to focus on?
              </h2>
              <p className="text-gray-500 mt-2">
                Select one of the topics below to continue.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {topics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicSelect(topic)}
                  className={`border border-gray-300 p-4 rounded-lg text-black hover:bg-blue-800 hover:text-white transition duration-300 font-medium ${
                    selectedTopic === topic ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {topic}
                </button>
              ))}
              {!isCustomInputVisible ? (
                <button
                  onClick={handleAddCustomTopic}
                  className="border border-gray-300 p-4 rounded-lg text-black hover:bg-gray-100 transition duration-300"
                >
                  Add your own +
                </button>
              ) : (
                <input
                  type="text"
                  value={customTopic}
                  onChange={handleCustomTopicChange}
                  className="border border-gray-300 p-4 rounded-lg text-black"
                  placeholder="Enter your custom topic"
                />
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={handleBack} className=" text-black py-2 px-9 rounded-lg hover:bg-gray-100">
                Back
              </button>
              <button
                onClick={handleContinue}
                className=" text-white py-2 px-6 rounded-lg bg-gray-800 hover:bg-blue-900 transition duration-300"
                disabled={!selectedTopic && !customTopic} // Disable if no topic or custom topic selected
              >
                Continue →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopicSelection;

