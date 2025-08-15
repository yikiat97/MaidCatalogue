import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api.js';
import AdminLogo from '../../components/admin/AdminLogo';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (res.ok) {
        const result = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.CALLBACK), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (result.ok) {
          const userData = await result.json();
          console.log('Admin user data:', userData);
          navigate('/admin');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    loginCard: {
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      position: 'relative',
      overflow: 'hidden'
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      color: '#1f2937',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '30px'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '15px 50px 15px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
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
      color: '#9ca3af',
      cursor: 'pointer',
      fontSize: '16px'
    },
    button: {
      width: '100%',
      padding: '15px 20px',
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    disabledButton: {
      opacity: '0.6',
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.logoContainer}>
          <div className="flex justify-center mb-4">
            <AdminLogo size="large" />
          </div>
          <h2 style={styles.title}>System Access</h2>
          <p style={styles.subtitle}>
            Enter your credentials to access the management system
          </p>
        </div>
        
        <div>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1f2937'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
              onFocus={(e) => e.target.style.borderColor = '#1f2937'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <span 
              style={styles.inputIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '🔒'}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.disabledButton : {})
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(31, 41, 55, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Accessing...' : 'Access System'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
} 