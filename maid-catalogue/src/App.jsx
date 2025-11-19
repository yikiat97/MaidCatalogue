import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue/Catalogue';
import MaidDetails from './pages/Catalogue/MaidDetails';
import Shortlisted from './pages/Catalogue/Shortlisted';
import Signup from './pages/Signup';
import Recommend from './pages/Catalogue/Recommend';
import CardVariations from './pages/Catalogue/CardVariations';
import { MaidContextProvider } from './context/maidList';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import FAQsPage from './pages/FAQs';
import ContactPage from './pages/Contact';
import PricingPage from './pages/Pricing';
import PriceCardPage from './pages/PriceCard';
import Admin from "./pages/admin/admin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/userManagement";
import AdminUserPage from './pages/admin/AdminUserPage';
import SuppliersManagement from './pages/admin/SuppliersManagement';
import ResetPassword from './pages/ResetPassword';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import ScrollToTop from './components/common/ScrollToTop';


// Component to conditionally render WhatsApp widget
function ConditionalFloatingWhatsApp() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                       location.pathname === '/system-access';
  
  return !isAdminRoute ? <FloatingWhatsApp /> : null;
}

// Component to get authentication state
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* <Route path="/services" element={<ServicesPage />} /> */}
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/price-card" element={<PriceCardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/catalogue"
          element={<Catalogue />}
        />
        <Route
          path="/card-variations"
          element={<CardVariations />}
        />
        <Route
          path="/maid/:id"
          element={
            isLoading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
              }}>
                Loading...
              </div>
            ) : isAuthenticated ? (
              <MaidDetails />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/shortlisted"
          element={
            isLoading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
              }}>
                Loading...
              </div>
            ) : isAuthenticated ? (
              <Shortlisted />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/recommend"
          element={<Recommend />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/system-access"
          element={
            <AdminLogin />
          }
        />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard />
          }
        />
        <Route
          path="/admin/maidManagement"
          element={
            <Admin />
          }
        />
         <Route path="/admin/maidManagement/:userId" element={<Admin />} />
        <Route
          path="/admin/userManagement"
          element={
            <UserManagement />
          }
        />
        <Route
          path="/admin/suppliers"
          element={
            <SuppliersManagement />
          }
        />
      </Routes>
      <ConditionalFloatingWhatsApp />
    </Router>
  );
}

// Main App component with providers
export default function App() {
  return (
    <AuthProvider>
      <MaidContextProvider>
        <AppContent />
      </MaidContextProvider>
    </AuthProvider>
  );
}