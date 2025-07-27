import { useState } from 'react';
import logoBlack from '../assets/logoBlack.png';

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {  
        alert('Login failed: ' + (await res.text()));
        return;
      }

      if (res.ok) {
        const result = await fetch('http://localhost:3000/api/user/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        console.log(result)
        const data = await result.json();
        
        if (data.redirectTo) {
          window.location.href = data.redirectTo
        }
      }
    } catch (err) {
      console.error(err);
      alert('Login failed due to server error.');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        alert('Reset password link has been sent to your email');
        setShowForgotModal(false);
        setForgotEmail('');
      } else {
        const errorText = await res.text();
        alert('Failed to send reset email: ' + errorText);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send reset email due to server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openForgotModal = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
  };

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
    loginCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
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
      width: '80px',
      height: '80px',
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
      borderLeft: '40px solid transparent',
      borderRight: '40px solid transparent',
      borderBottom: '30px solid #ff8c42',
      position: 'absolute',
      top: '0',
      left: '0'
    },
    roofOutline: {
      width: '0',
      height: '0',
      borderLeft: '42px solid transparent',
      borderRight: '42px solid transparent',
      borderBottom: '32px solid #ff6b1a',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      zIndex: '1'
    },
    chimney: {
      width: '8px',
      height: '15px',
      background: '#ff8c42',
      position: 'absolute',
      top: '8px',
      right: '15px',
      zIndex: '2'
    },
    houseBody: {
      width: '60px',
      height: '40px',
      background: 'white',
      border: '3px solid #ff8c42',
      borderRadius: '0 0 5px 5px',
      position: 'absolute',
      top: '25px',
      left: '10px'
    },
    window: {
      width: '16px',
      height: '16px',
      background: '#ff8c42',
      position: 'absolute',
      top: '8px',
      left: '22px'
    },
    windowCross: {
      position: 'absolute',
      top: '6px',
      left: '6px',
      width: '4px',
      height: '4px'
    },
    brandText: {
      fontSize: '28px',
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
      fontSize: '14px',
      color: '#666',
      margin: '5px 0 0 0',
      fontWeight: '400'
    },
    welcome: {
      fontSize: '28px',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '10px',
      marginTop: '-40px'
    },
    description: {
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    logoImage: {
      marginTop: '-30px'
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
    inputIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999',
      cursor: 'pointer'
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
    forgotPassword: {
      textAlign: 'center',
      marginTop: '20px'
    },
    forgotLink: {
      color: '#ff8c42',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
      padding: '20px'
    },
    modal: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      width: '100%',
      maxWidth: '400px',
      position: 'relative',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 10px 0'
    },
    modalSubtitle: {
      fontSize: '14px',
      color: '#666',
      margin: '0'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    },
    modalInput: {
      width: '100%',
      padding: '15px 20px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      marginBottom: '20px'
    },
    modalButtonGroup: {
      display: 'flex',
      gap: '10px'
    },
    cancelButton: {
      flex: '1',
      padding: '12px 20px',
      background: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    submitButton: {
      flex: '1',
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    disabledButton: {
      opacity: '0.6',
      cursor: 'not-allowed'
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={styles.decorativeElement}></div>   
          <img
            src={logoBlack}
            alt="EasyHire Logo"
            style={styles.logoImage}
          />
          <h2 style={styles.welcome}>Welcome Back</h2>
          <p style={styles.description}>
            Welcome to EasyHire. Please enter your Email and Password below. 
          </p>
          <div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <span style={styles.inputIcon}>👤</span>
            </div>

            <div style={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <span 
                style={styles.inputIcon}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️' : '🔒'}
              </span>
            </div>

            <button
              onClick={handleLogin}
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 26, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign In
            </button>
          </div>

          <div style={styles.forgotPassword}>
            <a href="#" style={styles.forgotLink} onClick={openForgotModal}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && ( 
        <div style={styles.modalOverlay} onClick={closeForgotModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={closeForgotModal}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#999';
              }}
            >
              ×
            </button>
            
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Reset Password</h3>
              <p style={styles.modalSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <input
              type="email"
              placeholder="Enter your email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={styles.modalInput}
              onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isSubmitting) {
                  handleForgotPassword();
                }
              }}
            />

            <div style={styles.modalButtonGroup}>
              <button
                style={styles.cancelButton}
                onClick={closeForgotModal}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.submitButton,
                  ...(isSubmitting ? styles.disabledButton : {})
                }}
                onClick={handleForgotPassword}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 5px 15px rgba(255, 107, 26, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}