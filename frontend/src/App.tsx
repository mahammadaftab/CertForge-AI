import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Intelligence from './pages/Intelligence';
import SemanticLayer from './pages/SemanticLayer';
import AssessmentCenter from './pages/AssessmentCenter';
import SuccessPredictor from './pages/SuccessPredictor';
import Placeholder from './pages/Placeholder';
import AppLayout from './components/AppLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
            path="/employees" 
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute>
                <Intelligence />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <PrivateRoute>
                <SemanticLayer />
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
          <Route path="/certifications" element={<PrivateRoute><Placeholder title="Certification Catalog" /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Placeholder title="System Settings" /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
