import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './LoginPage.css';

// Access environment variable using import.meta.env
const FIXED_PASSWORD = import.meta.env.VITE_FIXED_PASSWORD;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { email, password });

      // Check password against fixed password from environment variable
      if (password !== FIXED_PASSWORD) {
        throw new Error('Invalid password.');
      }

      // Simulate successful login and navigate
      // Replace with actual login logic if needed
      setSuccess('Logged in successfully!');
      setError(null);
      navigate('/'); // Redirect to home page after login

    } catch (error) {
      // Handle errors
      console.error('Login Error:', error.message); // Debug log
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default LoginPage;
