
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GroupSettings = () => {
    const [fontFace, setFontFace] = useState('Arial');
    const [colorScheme, setColorScheme] = useState('#500000');
    const [delay, setDelay] = useState('');
    const [preMessage, setPreMessage] = useState('');
    const [questions, setQuestions] = useState('');

    const handleSaveSettings = () => {
        alert('Settings saved (placeholder)');
    };

    return (
        <div className="container">
            <h2>Customize Group Settings</h2>

            <label>Font Face:</label>
            <select value={fontFace} onChange={(e) => setFontFace(e.target.value)}>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
            </select>

            <label>Color Scheme:</label>
            <input 
                type="color" 
                value={colorScheme} 
                onChange={(e) => setColorScheme(e.target.value)} 
            />

            <label>Delay Parameters (ms):</label>
            <input 
                type="number" 
                placeholder="e.g., 1000" 
                value={delay} 
                onChange={(e) => setDelay(e.target.value)} 
            />

            <label>Pre-Answer Messaging:</label>
            <input 
                type="text" 
                placeholder="Type your message here" 
                value={preMessage} 
                onChange={(e) => setPreMessage(e.target.value)} 
            />

            <label>Questions and Answers:</label>
            <textarea 
                placeholder="Enter questions and answers here" 
                value={questions} 
                onChange={(e) => setQuestions(e.target.value)} 
            ></textarea>

            <button onClick={handleSaveSettings}>Save Settings</button>

            <Link to="/dashboard">
                <button>Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default GroupSettings;
