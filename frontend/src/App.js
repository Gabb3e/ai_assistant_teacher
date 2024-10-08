import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import these correctly
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import TopicSelection from './TopicSelection';
import QuestionCount from './QuestionCount';
import KnowledgeLevel from './KnowledgeLevel';
import QuizPage from './QuizPage';
import QuizResults from './QuizResults';
import Login from './Login';
import Register from './Register';
import SubjectSelection from './SubjectSelection';
import Onboarding from './Onboarding';
import LoadingPage from './LoadingPage';
import Profile from './Profile';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/TopicSelection" element={<TopicSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/QuestionCount" element={<QuestionCount />} />
        <Route path="/KnowledgeLevel" element={<KnowledgeLevel />} />
        <Route path="/QuizPage" element={<QuizPage />} />
        <Route path="/QuizResults" element={<QuizResults />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Nav" element={<Register />} />
        <Route path="/SubjectSelection" element={<SubjectSelection />} />
        <Route path="/LoadingPage" element={<LoadingPage />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
