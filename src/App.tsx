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

import AuthSuccessPage from './pages/AuthSuccessPage';
import OnboardingGuardian from './components/OnboardingGuardian';

function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <ProblemProvider>
          <Router>
            <OnboardingGuardian>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/success" element={<AuthSuccessPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/ide" element={<ProblemSolver />} />
                <Route path="/problem/:slug" element={<ProblemPage />} />
              </Routes>
            </OnboardingGuardian>
          </Router>
        </ProblemProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;

