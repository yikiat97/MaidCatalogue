import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_CONFIG from '../config/api.js';
import logoBlack from '../assets/logoBlack.png';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setIsTokenValid(false);
    }
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    return errors;
  };

  const handleResetPassword = async () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const newErrors = {};
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors[0]; // Show first error
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      if (res.ok) {
        setResetSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login'; // or wherever your login page is
        }, 3000);
      } else {
        const errorText = await res.text();
        if (errorText.includes('expired') || errorText.includes('invalid')) {
          setIsTokenValid(false);
        } else {
          setErrors({ general: 'Failed to reset password: ' + errorText });
        }
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Failed to reset password due to server error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '' };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /(?=.*[a-z])/.test(password),
      /(?=.*[A-Z])/.test(password),
      /(?=.*\d)/.test(password),
      /(?=.*[!@#$%^&*])/.test(password)
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { strength: 1, text: 'Weak', color: '#ff4757' };
    if (score <= 3) return { strength: 2, text: 'Fair', color: '#ffa502' };
    if (score <= 4) return { strength: 3, text: 'Good', color: '#2ed573' };
    return { strength: 4, text: 'Strong', color: '#2ed573' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      padding: '40px',
      width: '100%',
      maxWidth: '450px',
      position: 'relative',
      overflow: 'hidden'
    },
    decorativeElement: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '100px',
      height: '100px',
      background: 'linear-gradient(45deg, #ff8c42, #ff6b1a)',
      borderRadius: '50%',
      opacity: '0.1'
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      width: '60px',
      height: '60px',
      margin: '0 auto 15px',
      position: 'relative'
    },
    house: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    roof: {
      width: '0',
      height: '0',
      borderLeft: '30px solid transparent',
      borderRight: '30px solid transparent',
      borderBottom: '22px solid #ff8c42',
      position: 'absolute',
      top: '0',
      left: '0'
    },
    roofOutline: {
      width: '0',
      height: '0',
      borderLeft: '32px solid transparent',
      borderRight: '32px solid transparent',
      borderBottom: '24px solid #ff6b1a',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      zIndex: '1'
    },
    chimney: {
      width: '6px',
      height: '12px',
      background: '#ff8c42',
      position: 'absolute',
      top: '6px',
      right: '12px',
      zIndex: '2'
    },
    houseBody: {
      width: '45px',
      height: '30px',
      background: 'white',
      border: '2px solid #ff8c42',
      borderRadius: '0 0 4px 4px',
      position: 'absolute',
      top: '18px',
      left: '7.5px'
    },
    window: {
      width: '12px',
      height: '12px',
      background: '#ff8c42',
      position: 'absolute',
      top: '6px',
      left: '16.5px'
    },
    brandText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: '0'
    },
    easyText: {
      color: '#ff8c42'
    },
    hireText: {
      color: '#333'
    },
    subtitle: {
      fontSize: '12px',
      color: '#666',
      margin: '5px 0 0 0',
      fontWeight: '400'
    },
    title: {
      fontSize: '28px',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '10px',
      marginTop: '-80px'
    },
    logoImage: {
      marginTop: '-40px'
    },
    description: {
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '15px 50px 15px 20px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#ff4757'
    },
    inputIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999',
      cursor: 'pointer'
    },
    errorText: {
      color: '#ff4757',
      fontSize: '12px',
      marginTop: '5px',
      marginLeft: '5px'
    },
    passwordStrength: {
      marginTop: '8px',
      marginLeft: '5px'
    },
    strengthBar: {
      height: '4px',
      borderRadius: '2px',
      backgroundColor: '#e0e0e0',
      overflow: 'hidden',
      marginBottom: '5px'
    },
    strengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '2px'
    },
    strengthText: {
      fontSize: '12px',
      fontWeight: '500'
    },
    button: {
      width: '100%',
      padding: '15px 20px',
      background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    disabledButton: {
      opacity: '0.6',
      cursor: 'not-allowed'
    },
    backToLogin: {
      textAlign: 'center',
      marginTop: '20px'
    },
    backLink: {
      color: '#ff8c42',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    },
    successContainer: {
      textAlign: 'center',
      padding: '20px'
    },
    successIcon: {
      fontSize: '48px',
      color: '#2ed573',
      marginBottom: '20px'
    },
    successTitle: {
      fontSize: '24px',
      color: '#333',
      fontWeight: '600',
      marginBottom: '10px'
    },
    successText: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '20px'
    },
    errorIcon: {
      fontSize: '48px',
      color: '#ff4757',
      marginBottom: '20px'
    },
    errorTitle: {
      fontSize: '24px',
      color: '#333',
      fontWeight: '600',
      marginBottom: '10px'
    },
    errorText: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px'
    }
  };

  // If token is invalid
  if (!isTokenValid) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.decorativeElement}></div>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h2 style={styles.errorTitle}>Invalid Reset Link</h2>
            <p style={styles.errorText}>
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
            <button
              style={styles.button}
              onClick={() => window.location.href = '/login'}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 26, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If reset was successful
  if (resetSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.decorativeElement}></div>
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Password Reset Successful</h2>
            <p style={styles.successText}>
              Your password has been successfully reset. You will be redirected to the login page in a few seconds.
            </p>
            <button
              style={styles.button}
              onClick={() => window.location.href = '/login'}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 26, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.decorativeElement}></div>
        
        <div style={styles.logoContainer}>
          <img
            src={logoBlack}
            alt="EasyHire Logo"
            style={styles.logoImage}
          />
        </div>

        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.description}>
          Enter your new password below. Make sure it's strong and secure.
        </p>

        {errors.general && (
          <div style={{...styles.errorText, textAlign: 'center', marginBottom: '20px'}}>
            {errors.general}
          </div>
        )}

        <div>
          <div style={styles.inputGroup}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.newPassword ? styles.inputError : {})
              }}
              onFocus={(e) => e.target.style.borderColor = errors.newPassword ? '#ff4757' : '#ff8c42'}
              onBlur={(e) => e.target.style.borderColor = errors.newPassword ? '#ff4757' : '#e0e0e0'}
            />
            <span 
              style={styles.inputIcon}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? '👁️' : '🔒'}
            </span>
            {errors.newPassword && (
              <div style={styles.errorText}>{errors.newPassword}</div>
            )}
            {newPassword && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthBar}>
                  <div 
                    style={{
                      ...styles.strengthFill,
                      width: `${(passwordStrength.strength / 4) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <div style={{...styles.strengthText, color: passwordStrength.color}}>
                  {passwordStrength.text}
                </div>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {})
              }}
              onFocus={(e) => e.target.style.borderColor = errors.confirmPassword ? '#ff4757' : '#ff8c42'}
              onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#ff4757' : '#e0e0e0'}
            />
            <span 
              style={styles.inputIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '🔒'}
            </span>
            {errors.confirmPassword && (
              <div style={styles.errorText}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            onClick={handleResetPassword}
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.disabledButton : {})
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 26, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>

        <div style={styles.backToLogin}>
          <a href="/login" style={styles.backLink}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}