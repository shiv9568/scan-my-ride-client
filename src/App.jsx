import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// ✅ Lazy-load all pages — only downloaded when the route is visited
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard3 = lazy(() => import('./pages/Dashboard3'));
const PublicProfile3 = lazy(() => import('./pages/PublicProfile3'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InstallPWA = lazy(() => import('./components/InstallPWA'));

// ✅ Minimal loading spinner — shown while a lazy chunk is downloading
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color, #fff)',
  }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '3px solid #f4b00b33',
      borderTop: '3px solid #f4b00b',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <PageLoader />;
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);
  if (loading) return <PageLoader />;
  if (!token) return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  document.documentElement.setAttribute('data-ui-mode', 'light');
  document.documentElement.setAttribute('data-theme', 'carbon');

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            {/* ✅ Suspense wraps ALL routes — shows PageLoader while chunk loads */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
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
              <InstallPWA />
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
