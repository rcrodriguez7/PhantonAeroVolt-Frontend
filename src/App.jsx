import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './services/auth';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Bids from './pages/Bids';
import Proposals from './pages/Proposals';

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bids"
          element={
            <ProtectedRoute>
              <Bids />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proposals"
          element={
            <ProtectedRoute>
              <Proposals />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;