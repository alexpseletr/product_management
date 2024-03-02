import React, { useState } from 'react';

function Register({ onClickLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setUsername(username);
        setPassword('');
        setConfirmPassword('');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          onClickLogin();
        }, 1000);
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      setError('Failed to register');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegisterClick} className="form">
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        {showSuccessMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>Registered successfully! Please login.</p>}
        <button type="submit" className="button" data-testid="button-register">Register</button>
      </form>
    </div>
  );
}

export default Register;
