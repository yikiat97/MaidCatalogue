import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/api.js';
import { cn } from "../lib/utils"
import  Button  from "../components/ui/Button"
import  Card, { CardContent }  from "../components/ui/card"
import  { Input }  from "../components/ui/input"
import  {Label}  from "../components/ui/label"

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, updateUser, fetchUserProfile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        console.log('Login successful:', result.user);
        
        // Explicit state updates to ensure UI refresh
        updateUser(result.user);
        await fetchUserProfile();
        
        // Check if there's a redirect URL stored (from recommendation link)
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        console.log('🔍 Login: redirectUrl found:', redirectUrl);
        
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else if (redirectUrl) {
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
              navigate(redirectUrl.replace(window.location.origin, ''));
            } else {
              console.error('Auth callback failed:', callbackRes.status);
              // Still redirect even if callback fails
              navigate(redirectUrl.replace(window.location.origin, ''));
            }
          } catch (err) {
            console.error('Auth callback error:', err);
            // Still redirect even if callback fails
            navigate(redirectUrl.replace(window.location.origin, ''));
          }
        } else {
          navigate('/catalogue');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setError('Please enter your email address first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
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

  // Removed inline styles

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <Card className="overflow-hidden bg-white">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">Login to your EasyHire account</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline" onClick={openForgotModal}>
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary-orange text-white hover:bg-primary-orange/90" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-primary-orange font-medium hover:underline">
                    Sign up
                  </Link>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
            </form>
            <div className="hidden md:flex items-center justify-center p-8">
              <img
                src="/images/img_logo.png"
                alt="EasyHire Logo"
                className="max-w-xs max-h-64 object-contain dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotModal && ( 
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={closeForgotModal}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeForgotModal}
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isSubmitting) {
                    handleForgotPassword();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeForgotModal}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleForgotPassword}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}