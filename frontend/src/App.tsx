import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WorkforceMatrix from './pages/WorkforceMatrix';
import Intelligence from './pages/Intelligence';
import AssessmentCenter from './pages/AssessmentCenter';
import PredictorPage from './pages/SuccessPredictor';
import WorkIQ from './pages/WorkIQ';
import AICommandCenter from './pages/AICommandCenter';
import FabricIQ from './pages/FabricIQ';
import ExecutiveIntelligence from './pages/Reports';
import SystemSettings from './pages/SystemSettings';
import LandingPage from './pages/LandingPage';
import AgentStudio from './pages/AgentStudio';
import IntelligenceGraph from './pages/IntelligenceGraph';
import Analytics from './pages/Analytics';
import AccessDenied from './pages/AccessDenied';
import CertificationCatalog from './pages/CertificationCatalog';
import LearningPath from './pages/LearningPath';

const PrivateRoute: React.FC<{ children: React.ReactNode, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen bg-[#0A0F1E] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  // Role-Based Protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access Denied: Role "${user.role}" not in allowed list [${allowedRoles.join(', ')}]`);
    return <AccessDenied />;
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
              <PrivateRoute allowedRoles={[UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/certifications" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <CertificationCatalog />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/learning-path" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <LearningPath />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/assessments" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <AssessmentCenter />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/work-iq" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ASSOCIATE, UserRole.EMPLOYEE, UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <WorkIQ />
              </PrivateRoute>
            } 
          />

          {/* Root Admin / Admin Routes */}
          <Route 
            path="/agent-studio" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <AgentStudio />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/foundry-iq" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <Intelligence />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/intelligence-graph" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <IntelligenceGraph />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/system-settings" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <SystemSettings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/prediction-engine" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <PredictorPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/command-center" 
            element={
              <PrivateRoute allowedRoles={[UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <AICommandCenter />
              </PrivateRoute>
            } 
          />

          {/* Controller / Manager Routes */}
          <Route 
            path="/workforce-matrix" 
            element={
              <PrivateRoute allowedRoles={[UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <WorkforceMatrix />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute allowedRoles={[UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <Analytics />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/executive-intelligence" 
            element={
              <PrivateRoute allowedRoles={[UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <ExecutiveIntelligence />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/fabric-iq" 
            element={
              <PrivateRoute allowedRoles={[UserRole.CONTROLLER, UserRole.MANAGER, UserRole.ROOT_ADMIN, UserRole.ADMIN]}>
                <FabricIQ />
              </PrivateRoute>
            } 
          />

          {/* Redirects & Fallbacks */}
          <Route path="/predictor" element={<Navigate to="/prediction-engine" replace />} />
          <Route path="/settings" element={<Navigate to="/system-settings" replace />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
