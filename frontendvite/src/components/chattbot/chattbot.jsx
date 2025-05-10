import React, { useState, useEffect } from "react";

function Chattbot() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleVoiceInput = async () => {
    setIsListening(true);
    console.log("Listening started..."); // Log for debugging

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        console.log("Recording stopped..."); // Log for debugging
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        console.log("Audio Blob created:", audioBlob); // Log the blob

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

          console.log("Response status:", response.status); // Log status code

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("AI Response: ", data.ai_response); // Log AI response
          setMessages([...messages, { text: data.ai_response, sender: "bot" }]);
        } catch (error) {
          console.error("Error sending voice data:", error);
          setMessages([
            ...messages,
            {
              text: "Sorry, there was an error processing your voice input. Please try again.",
              sender: "bot",
            },
          ]);
        }

        setIsListening(false);
      });

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsListening(false);
      setMessages([
        ...messages,
        {
          text: "Sorry, there was an error accessing your microphone. Please check your permissions and try again.",
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 h-full shadow-lg rounded-lg p-4 overflow-hidden">
      <div className="flex-grow overflow-y-auto">
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
      <button
        onClick={handleVoiceInput}
        className="flex justify-center items-center mb-20 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src="/AI-logo.webp"
          alt="AI Logo"
          className="w-20 h-20 rounded-full"
        />
      </button>
    </div>
  );
}

export default Chattbot;
