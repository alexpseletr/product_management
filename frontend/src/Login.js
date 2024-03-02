import React, { useState } from 'react';
import Register from './Register';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Invalid username or password.');
        return;
      }
  
      const userData = await response.json();
      onLogin(userData);
      setError('');
    } catch (error) {
      console.error('Failed to login:', error);
      setError('Failed to login');
    }
  };

  const handleToggleForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  return (
    <div>
      {!showRegisterForm && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            <button type="submit" className="button" data-testid="login-button">Login</button>
          </form>
        </>
      )}
      {showRegisterForm && <Register onClickLogin={handleToggleForm} />}
      <p>
        {showRegisterForm ? 'Already have an account?' : "Don't have an account?"}{' '}
        <a href="#" onClick={handleToggleForm} data-testid="loginRegisterLink">{showRegisterForm ? 'Login' : 'Register'}</a>
      </p>
    </div>
  );
}

export default Login;
