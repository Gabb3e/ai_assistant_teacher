import React, { useState, useEffect } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");
  const [icon, setIcon] = useState("🌞"); // Default to the sun icon
  const [storedName, setStoredName] = useState("");

  useEffect(() => {
    const hour = new Date().getHours(); // Get the current hour
    const storedName = localStorage.getItem("first_name");
    if (storedName) {
      setStoredName(storedName);
    }
    if (hour < 12) {
      setGreeting("Good Morning");
      setIcon("🌅"); // Sunrise or morning icon
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
      setIcon("🌞"); // Afternoon sun icon
    } else {
      setGreeting("Good Evening");
      setIcon("🌜"); // Moon or evening icon
    }
  }, []); // Run this effect once when the component is mounted

  return (
    <span>
      <span role="img" aria-label="icon">
        {icon}
      </span>{" "}
      {greeting}, {storedName ?  <span className="font-bold">{storedName}</span> : null}
    </span>
  );
};

export default Greeting;
