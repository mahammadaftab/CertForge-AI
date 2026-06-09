import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WorkforceMatrix from './pages/WorkforceMatrix';
import Intelligence from './pages/Intelligence';
import AssessmentCenter from './pages/AssessmentCenter';
import SuccessPredictor from './pages/SuccessPredictor';
import WorkIQ from './pages/WorkIQ';
import AICommandCenter from './pages/AICommandCenter';
import FabricIQ from './pages/FabricIQ';
import Reports from './pages/Reports';
import Placeholder from './pages/Placeholder';
import LandingPage from './pages/LandingPage';
import AgentStudio from './pages/AgentStudio';
import IntelligenceGraph from './pages/IntelligenceGraph';

const PrivateRoute: React.FC<{ children: React.ReactNode, allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen bg-[#0A0F1E] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
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
              <PrivateRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                <AICommandCenter />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/workforce-matrix" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                <WorkforceMatrix />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/foundry-iq" 
            element={
              <PrivateRoute>
                <Intelligence />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/work-iq" 
            element={
              <PrivateRoute>
                <WorkIQ />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/fabric-iq" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                <FabricIQ />
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
          <Route 
            path="/agent-studio" 
            element={
              <PrivateRoute>
                <AgentStudio />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/intelligence-graph" 
            element={
              <PrivateRoute>
                <IntelligenceGraph />
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
