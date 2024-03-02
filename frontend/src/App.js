import React, { useState } from 'react';
import Products from './Products';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null); 

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthToken(userData.token);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="container">
      <h1 className="text-center">My App</h1>
      <div className="d-flex justify-content-center align-items-center vh-100">
        {user ? (
          <div>
            <p>Welcome, {user.username} !</p>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Login onLogin={handleLogin} onRegister={handleRegister}/>
        )}
      </div>
      {user && <Products authToken={authToken}/> }
    </div>
  );
}

export default App;
