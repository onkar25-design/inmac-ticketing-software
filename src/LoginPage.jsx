import React, { useState } from 'react';
import companyLogo from './components/dashboard/company-logo.png';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      onLogin(password);
    } else {
      setError('Please enter a password.');
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-container">
      <img src={companyLogo} alt="Company Logo" className="company-logo-LoginForm" />
        <h2 className="login-header">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="password">Password:</label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
