import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProblemProvider } from './contexts/ProblemContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import ProblemSolver from './components/ProblemSolver';

function App() {
  return (
    <AuthProvider>
      <ProblemProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ide" element={<ProblemSolver />} />
          </Routes>
        </Router>
      </ProblemProvider>
    </AuthProvider>
  );
}

export default App;

