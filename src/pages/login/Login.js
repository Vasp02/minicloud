import React, { useState } from 'react';
import './Login.css'; 
import { useAuth } from '../../AuthContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function LoginPage() {

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/account/login', credentials);
      console.log('Login successful:', response.data);
      const token = response.data.token;
      const username = response.data.username;
      localStorage.setItem('token', token);
      login(token, username);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : 'Unknown error');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
