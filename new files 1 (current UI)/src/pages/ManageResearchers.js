
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManageResearchers = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleAddResearcher = () => {
        setMessage('Researcher added (placeholder)');
    };

    const handleRemoveResearcher = () => {
        setMessage('Researcher removed (placeholder)');
    };

    return (
        <div className="container">
            <h2>Manage Researchers</h2>
            <input 
                type="email" 
                placeholder="Enter Researcher Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={handleAddResearcher}>Add Researcher</button>
            <button onClick={handleRemoveResearcher}>Remove Researcher</button>
            <p>{message}</p>

            <Link to="/dashboard">
                <button>Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default ManageResearchers;
