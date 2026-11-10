import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ToolDetail from './pages/ToolDetail';
import MyListings from './pages/MyListings';
import BorrowingRequests from './pages/BorrowingRequests';
import LenderRequests from './pages/LenderRequests';
import ListTool from './pages/ListTool';
import Profile from './pages/Profile';

function ProtectedLayout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/borrowing" element={<BorrowingRequests />} />
          <Route path="/lender" element={<LenderRequests />} />
          <Route path="/list-tool" element={<ListTool />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function PublicOnly({ children }) {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) navigate('/dashboard');
  }, [currentUser, navigate]);
  if (currentUser) return null;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
