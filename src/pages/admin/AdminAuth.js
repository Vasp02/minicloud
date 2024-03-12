import React, { useState } from 'react';
import axios from 'axios';
import './AdminAuth.css';
import { useNavigate } from 'react-router-dom';

function AdminAuth(){
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/account/login', credentials);
            console.log(response.data);
            localStorage.setItem('token', response.data.token); 
            navigate("/admin");
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default AdminAuth;