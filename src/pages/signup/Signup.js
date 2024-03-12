import React, { useState } from 'react';
import styles from './Signup.css'; 
import axios from 'axios';

function SignUpPage() {
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/account/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Sign up successful:', response.data);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Sign up failed:', error);
      alert(`Sign up failed! ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="signup-container">
        <h2 className="signup-heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
            <div className="signup-formGroup">
                <label className="signup-label">Username:</label>
                <input
                    className="signup-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="signup-formGroup">
                <label className="signup-label">Email:</label>
                <input
                    className="signup-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="signup-formGroup">
                <label className="signup-label">Password:</label>
                <input
                    className="signup-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="signup-button" type="submit">Sign Up</button>
        </form>
    </div>
);
}

export default SignUpPage;
