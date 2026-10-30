import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both Email ID and Password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Use the unified auth endpoint that authenticates or registers new users in MongoDB
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }

      setSuccessMessage(data.message || 'Logged in successfully!');
      setFormData({ email: '', password: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Title floating above the dark card matching reference */}
      <h1 className="login-page-title">USER LOGIN</h1>

      <div className="login-card">
        {/* Status Alerts */}
        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email ID Field */}
          <div className="input-field-row">
            <div className="input-icon-box" aria-hidden="true">
              <svg className="field-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email ID"
              className="text-input"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="input-field-row">
            <div className="input-icon-box" aria-hidden="true">
              <svg className="field-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="text-input"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Options Row: Remember me & Forgot Password? */}
          <div className="login-options-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="hidden-checkbox"
              />
              <span className={`custom-checkbox-box ${rememberMe ? 'checked' : ''}`}>
                {rememberMe && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className="remember-text">Remember me</span>
            </label>

            <a
              href="#forgot"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                alert('Reset instructions will be sent to your registered Email ID.');
              }}
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
