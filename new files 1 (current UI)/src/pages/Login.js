
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Hardcoded user credentials
        const validEmail = 'researcher@example.com';
        const validPassword = 'password123';

        if (email === validEmail && password === validPassword) {
            sessionStorage.setItem('loggedIn', 'true');
            navigate('/dashboard');
        } else {
            setError('Invalid email or password. Please try again.');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className="container">
            <h2>Sign In</h2>
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
