import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_CONFIG from '../config/api.js';
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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

      // Step 3: Call simple-callback to verify authentication (matching Login.jsx pattern)
      const result = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.SIMPLE_CALLBACK), {
        method: 'POST',
        credentials: 'include',
      });
      
      if (result.ok) {
        const userData = await result.json();
        console.log('User data:', userData);
        
        // Step 4: Check if there's a redirect URL stored (from recommendation link)
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        console.log('🔍 Signup: redirectUrl found:', redirectUrl);
        
        if (userData.role === 'admin') {
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
          navigate('/catalogue');
        }
      } else {
        setErrors({ submit: 'Authentication verification failed. Please try logging in.' });
      }

    } catch (error) {
      console.error('Signup/Login error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <Card className="overflow-hidden bg-white">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create Your Account</h1>
                  <p className="text-balance text-muted-foreground">Join EasyHire today</p>
                </div>
                
                {/* User Type Selector */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                      formData.role === 131
                        ? "bg-primary-orange text-white shadow-sm"
                        : "bg-transparent text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => handleInputChange('role', 131)}
                    disabled={isLoading}
                  >
                    👨‍💼 I'm an Employer
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
                      formData.role === 'helper'
                        ? "bg-primary-orange text-white shadow-sm"
                        : "bg-transparent text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => handleInputChange('role', 'helper')}
                    disabled={isLoading}
                  >
                    👩‍🏠 I'm a Helper
                  </button>
                </div>

                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={cn("pr-10", errors.password ? "border-red-500" : "")}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                  {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={cn("pr-10", errors.confirmPassword ? "border-red-500" : "")}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
                </div>

                {/* Terms and Conditions */}
                <div className={cn("flex items-start gap-3 p-4 rounded-lg border-2 transition-colors", 
                  errors.agreeToTerms ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50")}>
                  <button
                    type="button"
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold transition-all mt-0.5",
                      formData.agreeToTerms
                        ? "bg-primary-orange border-primary-orange text-white"
                        : "bg-white border-gray-300"
                    )}
                    onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                  >
                    {formData.agreeToTerms && '✓'}
                  </button>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    I agree to the <a href="#" className="text-primary-orange font-medium hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary-orange font-medium hover:underline">Privacy Policy</a>
                    {errors.agreeToTerms && <div className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</div>}
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="text-red-500 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary-orange text-white hover:bg-primary-orange/90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary-orange font-medium hover:underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
            
            <div className="hidden md:flex items-center justify-center p-8">
              <img
                src="/images/img_logo.png"
                alt="EasyHire Logo"
                className="max-w-xs max-h-64 object-contain"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}