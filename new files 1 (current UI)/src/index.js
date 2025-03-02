
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageResearchers from './pages/ManageResearchers';
import GroupSettings from './pages/GroupSettings';
import Logout from './pages/Logout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manage-researchers" element={<ManageResearchers />} />
                <Route path="/group-settings" element={<GroupSettings />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
