import { useState } from 'react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://18.140.119.246:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ important!
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert('Login failed: ' + (await res.text()));
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = '/Catalogue'; // or wherever you want to redirect
    } catch (err) {
      console.error(err);
      alert('Login failed due to server error.');
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      height: '4px',
      '::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '1.5px',
        width: '1px',
        height: '4px',
        background: 'white'
      },
      '::after': {
        content: '""',
        position: 'absolute',
        top: '1.5px',
        left: '0',
        width: '4px',
        height: '1px',
        background: 'white'
      }
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
      marginBottom: '30px'
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
    inputFocus: {
      borderColor: '#ff8c42',
      boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)'
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
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(255, 107, 26, 0.4)'
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.decorativeElement}></div>
        
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <div style={styles.house}>
              <div style={styles.roofOutline}></div>
              <div style={styles.roof}></div>
              <div style={styles.chimney}></div>
              <div style={styles.houseBody}>
                <div style={styles.window}>
                  <div style={styles.windowCross}></div>
                </div>
              </div>
            </div>
          </div>
          <h1 style={styles.brandText}>
            <span style={styles.easyText}>EASY</span>
            <span style={styles.hireText}>HIRE</span>
          </h1>
          <p style={styles.subtitle}>MAID SOLUTIONS</p>
        </div>

        <h2 style={styles.welcome}>Welcome Back</h2>

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
          <a href="#" style={styles.forgotLink}>
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}