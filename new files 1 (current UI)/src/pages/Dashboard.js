
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="container">
            <h2>Welcome to the Researcher Management Dashboard</h2>
            <nav>
                <Link to="/manage-researchers">
                    <button>Manage Researchers</button>
                </Link>
                <Link to="/group-settings">
                    <button>Group Settings</button>
                </Link>
                <Link to="/logout">
                    <button>Logout</button>
                </Link>
            </nav>
        </div>
    );
};

export default Dashboard;
