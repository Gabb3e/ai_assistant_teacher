import React, { useState, useEffect } from "react";

function Chattbot() {
  // State to store the conversation (messages)
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleVoiceInput = async () => {
    setIsListening(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
  
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
  
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
  
        try {
          const response = await fetch(
            "http://localhost:8000/voice-assistant",
            {
              method: "POST",
              body: formData,
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setMessages([...messages, { text: data.ai_response, sender: "bot" }]);
        } catch (error) {
          console.error("Error sending voice data:", error);
          setMessages([...messages, { text: "Sorry, there was an error processing your voice input. Please try again.", sender: "bot" }]);
        }
  
        setIsListening(false);
      });
  
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsListening(false);
      setMessages([...messages, { text: "Sorry, there was an error accessing your microphone. Please check your permissions and try again.", sender: "bot" }]);
    }
  };

  // Handle sending messages
  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage = {
        text: "That's interesting! Tell me more or ask me another question.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  // Handle form submission (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg max-w-xs ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/*<div className="bg-white p-4 border-t border-gray-300 flex">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>*/}

      <button
        onClick={handleVoiceInput}
        className="absolute bottom-10 right-4 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src="/AI-logo.webp"
          alt="AI Logo"
          className="w-16 h-16 rounded-full"
        />
      </button>
    </div>
  );
}

export default Chattbot;
