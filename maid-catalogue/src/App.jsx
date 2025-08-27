import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue/Catalogue';
import MaidDetails from './pages/Catalogue/MaidDetails';
import Shortlisted from './pages/Catalogue/Shortlisted';
import Signup from './pages/Signup';
import Recommend from './pages/Catalogue/Recommend';
import { MaidContextProvider } from './context/maidList';
// import { getToken } from './utils/auth';
import HomePage from './pages/Home';
import Admin from "./pages/admin/admin";
import AdminLogin from "./pages/admin/AdminLogin";
import UserManagement from "./pages/admin/userManagement";
import AdminUserPage from './pages/admin/AdminUserPage';
import ResetPassword from './pages/ResetPassword';


export default function App() {
  const isAuthenticated = true//!!getToken();

return (
  <MaidContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/MaidBio"
          element={
            isAuthenticated ? <Catalogue /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/maid/:id"
          element={
            isAuthenticated ? <MaidDetails /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/shortlisted"
          element={
            isAuthenticated ? <Shortlisted /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/Recommend"
          element={
            isAuthenticated ? <Recommend /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/Signup"
          element={
            isAuthenticated ? <Signup /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/system-access"
          element={
            <AdminLogin />
          }
        />
        <Route
          path="/admin"
          element={
            <Admin />
          }
        />
         <Route path="/admin/:userId" element={<Admin />} />
        <Route
          path="/userManagement"
          element={
            <UserManagement />
          }
        />
      </Routes>
    </Router>
  </MaidContextProvider>
);
}