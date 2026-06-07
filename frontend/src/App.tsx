import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Intelligence from './pages/Intelligence';
import AssessmentCenter from './pages/AssessmentCenter';
import SuccessPredictor from './pages/SuccessPredictor';
import LiveAnalytics from './pages/LiveAnalytics';
import AICommandCenter from './pages/AICommandCenter';
import Reports from './pages/Reports';
import Placeholder from './pages/Placeholder';
import LandingPage from './pages/LandingPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen bg-[#010204] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  
  if (window.location.pathname === '/command-center') {
     return <>{children}</>;
  }
  
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/command-center" 
            element={
              <PrivateRoute>
                <AICommandCenter />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/intelligence" 
            element={
              <PrivateRoute>
                <Intelligence />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute>
                <LiveAnalytics />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/assessments" 
            element={
              <PrivateRoute>
                <AssessmentCenter />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/predictor" 
            element={
              <PrivateRoute>
                <SuccessPredictor />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } 
          />
          <Route path="/settings" element={<PrivateRoute><Placeholder title="System Settings" /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
