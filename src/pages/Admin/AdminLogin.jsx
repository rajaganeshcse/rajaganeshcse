import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applyNoIndexSeo } from '../../utils/seo';
import './AdminLogin.css';

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="login-icon-svg">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.2 0-7 2.16-7 4.2 0 .44.36.8.8.8h12.4c.44 0 .8-.36.8-.8 0-2.04-2.8-4.2-7-4.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    applyNoIndexSeo({
      title: 'Profile Admin Login | Rajaganesh T',
      description: 'Admin login page for the Rajaganesh T portfolio.',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password.trim());
      navigate('/dashboard');
    } catch (err) {
      setError('Wrong username or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-page grid-bg">
      <div className="login-box">
        <div className="login-icon">
          <ProfileIcon />
        </div>
        <h2 className="login-title">Profile Admin</h2>
        <p className="login-sub">Sign in to upload and manage portfolio content</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              placeholder="Enter username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
