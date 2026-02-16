import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProblemProvider } from './contexts/ProblemContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import ProblemSolver from './components/ProblemSolver';
import ProblemPage from "./pages/ProblemPage";

function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <ProblemProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/ide" element={<ProblemSolver />} />
              <Route path="/problem/:slug" element={<ProblemPage />} />
            </Routes>
          </Router>
        </ProblemProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;

