import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../config/api.js';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 131, // 'employer' or 'helper'
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      // Step 1: Sign up the user
      const signupResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: formData.role
        }),
        credentials: 'include', // Important for cookies/sessions
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        // Handle signup errors
        if (signupData.message) {
          setErrors({ submit: signupData.message });
        } else {
          setErrors({ submit: 'Something went wrong during signup. Please try again.' });
        }
        return;
      }

      console.log('Signup successful:', signupData);

      // Step 2: Automatically log in the user after successful signup
      const loginResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important for cookies!
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (!loginResponse.ok) {
        // If auto-login fails, show message but still redirect to login
        console.error('Auto-login failed after signup');
        setErrors({ submit: 'Account created successfully! Please log in.' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      // Step 3: Check if there's a redirect URL stored (from recommendation link)
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      console.log('🔍 Signup: redirectUrl found:', redirectUrl);
      
      if (redirectUrl) {
        // Clear the stored URL
        localStorage.removeItem('redirectAfterLogin');
        
        // Call the auth callback endpoint to associate recommendation with user
        try {
          const callbackRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.CALLBACK), {
            method: 'POST',
            credentials: 'include',
          });
          
          if (callbackRes.ok) {
            const callbackData = await callbackRes.json();
            console.log('Auth callback successful:', callbackData);
            // Redirect back to recommendation page
            window.location.href = redirectUrl;
          } else {
            console.error('Auth callback failed:', callbackRes.status);
            // Still redirect even if callback fails
            window.location.href = redirectUrl;
          }
        } catch (err) {
          console.error('Auth callback error:', err);
          // Still redirect even if callback fails
          window.location.href = redirectUrl;
        }
      } else {
        // No redirect URL, use default behavior
        const callbackResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.CALLBACK), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        console.log('Auth callback response:', callbackResponse);
        const callbackData = await callbackResponse.json();
        
        if (callbackData.redirectTo) {
          // Success - redirect to the specified URL (likely /catalogue)
          console.log('Login successful, redirecting to:', callbackData.redirectTo);
          window.location.href = callbackData.redirectTo;
        } else {
          // Fallback redirect if no redirectTo is provided
          navigate('/MaidBio');
        }
      }

    } catch (error) {
      console.error('Signup/Login error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    signupCard: {
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
      background: 'linear-gradient(45deg, rgba(255, 140, 66, 0.1), rgba(255, 107, 26, 0.05))',
      borderRadius: '50%',
      opacity: '0.3'
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: '30px'
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
      fontSize: '24px',
      color: '#333',
      fontWeight: '300',
      textAlign: 'center',
      marginBottom: '30px',
      marginTop: '-50px'
    },
    userTypeSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '25px',
      padding: '4px',
      background: '#f8f9fa',
      borderRadius: '12px'
    },
    userTypeButton: {
      flex: 1,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'transparent',
      color: '#666'
    },
    userTypeButtonActive: {
      background: '#ff8c42',
      color: 'white',
      boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px',
      flex: 1
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '6px'
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
      top: '36px',
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
    submitError: {
      color: '#ff4757',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '10px',
      marginBottom: '15px',
      padding: '10px',
      background: '#fff5f5',
      borderRadius: '8px',
      border: '1px solid #ffebee'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '25px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '10px',
      border: '2px solid transparent'
    },
    checkboxContainerError: {
      borderColor: '#ff4757',
      background: '#fff5f5'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '2px solid #ddd',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s ease',
      background: 'white',
      flexShrink: 0,
      marginTop: '2px'
    },
    checkboxChecked: {
      background: '#ff8c42',
      borderColor: '#ff8c42'
    },
    checkmark: {
      position: 'absolute',
      top: '2px',
      left: '5px',
      width: '6px',
      height: '10px',
      border: 'solid white',
      borderWidth: '0 2px 2px 0',
      transform: 'rotate(45deg)'
    },
    termsText: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.5'
    },
    termsLink: {
      color: '#ff8c42',
      textDecoration: 'none',
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
      marginTop: '10px',
      opacity: isLoading ? '0.7' : '0.9',
      position: 'relative'
    },
    buttonDisabled: {
      cursor: 'not-allowed',
      opacity: '0.5'
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '20px'
    },
    loginText: {
      color: '#666',
      fontSize: '14px'
    },
    loginLinkText: {
      color: '#ff8c42',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer'
    },
    loading: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '10px'
    }
  };

  // Add keyframes for loading animation
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{spinKeyframes}</style>
      <div style={styles.signupCard}>
        <div style={styles.decorativeElement}></div>
        
        <div style={styles.logoContainer}>
          <img 
            src="/assets/logoBlack.png"  
            alt="EasyHire Logo"
            style={{
              width: '250px',
              height: 'auto',
              display: 'block',
              margin: '0 auto 20px auto'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{display: 'none'}}>
            <h1 style={styles.brandText}>
              <span style={styles.easyText}>EASY</span>
              <span style={styles.hireText}>HIRE</span>
            </h1>
            <p style={styles.subtitle}>MAID SOLUTIONS</p>
          </div>
        </div>

        <h2 style={styles.welcome}>Create Your Account</h2>

        {/* User Type Selector */}
        <div style={styles.userTypeSelector}>
          <button
            style={{
              ...styles.userTypeButton,
              ...(formData.role === 131 ? styles.userTypeButtonActive : {})
            }}
            onClick={() => handleInputChange('role', 131)}
            disabled={isLoading}
          >
            👨‍💼 I'm an Employer
          </button>
          <button
            style={{
              ...styles.userTypeButton,
              ...(formData.role === 'helper' ? styles.userTypeButtonActive : {})
            }}
            onClick={() => handleInputChange('role', 'helper')}
            disabled={isLoading}
          >
            👩‍🏠 I'm a Helper
          </button>
        </div>

        {/* Full Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              ...styles.input,
              padding: '15px 50px 15px 20px',
              ...(errors.name ? styles.inputError : {})
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
            onBlur={(e) => !errors.name && (e.target.style.borderColor = '#e0e0e0')}
            disabled={isLoading}
          />
          <span style={styles.inputIcon}>👤</span>
          {errors.name && <div style={styles.errorText}>{errors.name}</div>}
        </div>

        {/* Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {})
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
            onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e0e0e0')}
            disabled={isLoading}
          />
          <span style={styles.inputIcon}>📧</span>
          {errors.email && <div style={styles.errorText}>{errors.email}</div>}
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            style={{
              ...styles.input,
              ...(errors.password ? styles.inputError : {})
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
            onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e0e0e0')}
            disabled={isLoading}
          />
          <span 
            style={styles.inputIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '🔒'}
          </span>
          {errors.password && <div style={styles.errorText}>{errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            style={{
              ...styles.input,
              ...(errors.confirmPassword ? styles.inputError : {})
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff8c42'}
            onBlur={(e) => !errors.confirmPassword && (e.target.style.borderColor = '#e0e0e0')}
            disabled={isLoading}
          />
          <span 
            style={styles.inputIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁️' : '🔒'}
          </span>
          {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
        </div>

        {/* Terms and Conditions */}
        <div style={{
          ...styles.checkboxContainer,
          ...(errors.agreeToTerms ? styles.checkboxContainerError : {})
        }}>
          <div 
            style={{
              ...styles.checkbox,
              ...(formData.agreeToTerms ? styles.checkboxChecked : {})
            }}
            onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
          >
            {formData.agreeToTerms && <div style={styles.checkmark}></div>}
          </div>
          <div style={styles.termsText}>
            I agree to the <a href="#" style={styles.termsLink}>Terms and Conditions</a> and <a href="#" style={styles.termsLink}>Privacy Policy</a>
            {errors.agreeToTerms && <div style={styles.errorText}>{errors.agreeToTerms}</div>}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div style={styles.submitError}>
            {errors.submit}
          </div>
        )}

        <button
          onClick={handleSignUp}
          disabled={isLoading}
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 26, 0.25)';
              e.target.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.opacity = '0.9';
            }
          }}
        >
          {isLoading ? (
            <>
              <span style={styles.loading}></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div style={styles.loginLink}>
          <span style={styles.loginText}>
            Already have an account? 
            <a href="/login" style={styles.loginLinkText}> Sign in</a>
          </span>
        </div>
      </div>
    </div>
  );
}