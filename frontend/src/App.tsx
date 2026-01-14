import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/Auth/Auth';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import Layout from './components/layout/Layout';
import { Home } from './pages/Home/Home';
import { Settings } from './pages/Settings/Settings';
import { tokenManager } from './services/core/tokenManager';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const hasTokens = tokenManager.hasTokens();

  // If no user and no tokens, redirect to auth
  if (!user && !hasTokens) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorProvider>
          <AppRoutes />
        </ErrorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;