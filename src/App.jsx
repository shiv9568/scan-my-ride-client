import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard3 from './pages/Dashboard3';
import PublicProfile3 from './pages/PublicProfile3';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  // Enforce light mode globally — yellow & white only
  document.documentElement.setAttribute('data-ui-mode', 'light');
  document.documentElement.setAttribute('data-theme', 'carbon');

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <ErrorBoundary>
                  <Dashboard3 />
                </ErrorBoundary>
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/p/:uniqueId" element={<PublicProfile3 />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
