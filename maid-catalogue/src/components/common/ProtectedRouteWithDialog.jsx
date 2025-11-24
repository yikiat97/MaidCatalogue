import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPrompt from './LoginPrompt';

const ProtectedRouteWithDialog = ({ children, isAuthenticated, isLoading }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowDialog(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleDialogClose = (open) => {
    if (!open) {
      // If dialog is closed, navigate back to home
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt open={showDialog} onOpenChange={handleDialogClose} />;
  }

  return children;
};

export default ProtectedRouteWithDialog;

