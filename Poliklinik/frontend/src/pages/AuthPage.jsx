import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthTabs from '../components/auth/AuthTabs';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Ensure you configure axios instance for your django backend (e.g., http://localhost:8000/api)
// Assuming axios defaults are handled elsewhere, but for demo:
axios.defaults.withCredentials = true; // Important for receiving HttpOnly cookies

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', credentials);
      if (response.status === 200) {
        setSuccessMsg("Logged in successfully! Redirecting...");
        
        // Save tokens to localStorage as requested
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user_role', response.data.role);
        localStorage.setItem('user_name', response.data.user_name || 'Yılmaz');

        const userRole = response.data.role;
        setTimeout(() => {
          if (userRole === 'doctor') {
            navigate('/dashboard');
          } else {
            navigate('/appointment');
          }
        }, 1000);
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (typeof data === 'object') {
          const errorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join(' | ');
          setError(errorMessages);
        } else {
          setError(JSON.stringify(data));
        }
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', data);
      if (response.status === 201) {
        setSuccessMsg("Registration successful! Redirecting...");
        setTimeout(() => navigate('/appointment'), 1000);
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (typeof data === 'object') {
          // Combine all field errors into a single readable string
          const errorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join(' | ');
          setError(errorMessages);
        } else {
          setError(JSON.stringify(data));
        }
      } else {
        // Fallback to the network error message or generic string
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthTabs activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setError(null);
        setSuccessMsg(null);
      }} />
      
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-200">
            {successMsg}
        </div>
      )}

      {activeTab === 'login' ? (
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      ) : (
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
      )}
    </AuthLayout>
  );
}
