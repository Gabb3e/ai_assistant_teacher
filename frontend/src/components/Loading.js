import React, { useState, useEffect } from "react";

const LoadingBar = ({ loadingCompleteCallback, text }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 10; // Increment progress
      });
    }, 1800); // Progress updates every 300ms

    return () => clearInterval(progressInterval);
  }, [loadingCompleteCallback]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-4">
        <h1 className="text-xl font-semibold text-gray-700 mb-4 text-center animate-pulse">
          {text}
        </h1>
        {/* Loading Bar */}
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-600 mt-2">{progress}% loaded</p>
      </div>
    </div>
  );
};

export default LoadingBar;
