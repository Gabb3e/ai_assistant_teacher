import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import these correctly
import Hero from './Hero';
import Onb1 from './Onb1';
import Onb2 from './Onb2';
import Onb3 from './Onb3';
import Onb4 from './Onb4';
import Dashboard from './Dashboard';
import TopicSelection from './TopicSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/onb1" element={<Onb1 />} />
        <Route path="/onb2" element={<Onb2 />} />
        <Route path="/onb3" element={<Onb3 />} />
        <Route path="/onb4" element={<Onb4 />} />
        <Route path="/TopicSelection" element={<TopicSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
