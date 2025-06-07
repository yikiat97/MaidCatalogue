import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue';
import MaidDetails from './pages/MaidDetails';
import Shortlisted from './pages/Shortlisted';
import Signup from './pages/Signup';
// import { getToken } from './utils/auth';

export default function App() {
  const isAuthenticated = true//!!getToken();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Catalogue /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/maid/:id" element={
           isAuthenticated ? <MaidDetails/> : <Navigate to="/login" replace/>
          }
        />
        <Route path="/shortlisted" element={
           isAuthenticated ? <Shortlisted/> : <Navigate to="/login" replace/>
          }
        />
        <Route path="/Signup" element={
           isAuthenticated ? <Signup/> : <Navigate to="/login" replace/>
          }
        />
      </Routes>
    </Router>
  );
}
