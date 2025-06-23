import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue';
import MaidDetails from './pages/MaidDetails';
import Shortlisted from './pages/Shortlisted';
import Signup from './pages/Signup';
import Recommend from './pages/Recommend';
import { MaidContextProvider } from './context/maidList';
// import { getToken } from './utils/auth';
import HomePage from './pages/Home';

export default function App() {
  const isAuthenticated = true//!!getToken();

return (
  <MaidContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/Catalogue"
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
      </Routes>
    </Router>
  </MaidContextProvider>
);
}