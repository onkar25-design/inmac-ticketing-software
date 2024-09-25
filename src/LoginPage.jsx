import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './LoginPage.css';
import companyLogo from '../src/components/forms/company-logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add('login-page');

    // Remove class from body when component unmounts
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt for email:', email);

    try {
      // Query the allowed_users table
      const { data: allowedUser, error: allowedUserError } = await supabase
        .from('allowed_users')
        .select()
        .eq('email', email)
        .single();

      if (allowedUserError) {
        console.error('Error querying allowed_users:', allowedUserError);
        throw allowedUserError;
      }

      console.log('Allowed user data:', allowedUser);

      if (allowedUser && allowedUser.password === password) {
        console.log('Email and password match in allowed_users');
        
        // Attempt to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          console.error('Sign in error:', error);
          if (error.message === 'Invalid login credentials') {
            console.log('User not found in Supabase auth, attempting to create');
            // User doesn't exist in Supabase auth, so create them
            const { data: newUser, error: signUpError } = await supabase.auth.signUp({
              email: email,
              password: password,
            });

            if (signUpError) {
              console.error('Sign up error:', signUpError);
              throw signUpError;
            }

            console.log('New user created:', newUser);

            // Check if email confirmation is required
            if (newUser.user && newUser.user.confirmation_sent_at) {
              setError('Please check your email to confirm your account before logging in.');
              return;
            }
          } else {
            throw error;
          }
        } else {
          console.log('User signed in successfully:', data);
        }

        // If we've reached here, the user is either signed in or newly created
        console.log('Navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Invalid email or password in allowed_users table');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Caught error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
        <img src={companyLogo} alt="Company Logo" className="company-logo-LoginForm" />
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="login-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <label htmlFor="password" className="login-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
