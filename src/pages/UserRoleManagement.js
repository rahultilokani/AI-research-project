import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // New user form fields
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('survey-taker');

  // Replace with your actual API endpoint
  const API_BASE_URL = 'https://llbkoyb0a2.execute-api.us-east-2.amazonaws.com';

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current admin user's session for the token
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new user
  const addUser = async (e) => {
    e.preventDefault();
    if (!newUserEmail) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add user: ${response.status}`);
      }

      // Refresh the user list
      fetchUsers();

      setSuccessMessage(`User ${newUserEmail} added successfully with role: ${newUserRole}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('survey-taker');
    } catch (err) {
      console.error('Error adding user:', err);
      setError(`Failed to add user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update a user's role
  const updateUserRole = async (username, newRole) => {
    try {
      setLoading(true);
      setError(null);

      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      // Get the actual Cognito username (UUID) instead of using the email address
      const userToUpdate = users.find(user => {
        const userEmail = user.Attributes?.find(attr => attr.Name === 'email')?.Value;
        return userEmail === username;
      });
      
      if (!userToUpdate) {
        throw new Error(`User with email ${username} not found`);
      }
      
      // Use the actual username (UUID) from Cognito instead of the email
      const cognitoUsername = userToUpdate.Username;

      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(cognitoUsername)}/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user role: ${response.status}`);
      }

      // Refresh the user list
      fetchUsers();

      setSuccessMessage(`Role updated successfully for ${username}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update role for ${username}. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Dropdown change handler
  const handleRoleChange = (username, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRole(username, newRole);
    }
  };

  // Example roles
  const availableRoles = ['admin', 'researcher', 'survey-taker'];

  return (
    <div className="user-role-management">
      <h2>User Role Management</h2>

      {error && (
        <div style={{ color: 'red', background: '#ffeeee', padding: '10px', marginBottom: '20px' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>Dismiss</button>
        </div>
      )}

      {successMessage && (
        <div style={{ color: 'green', background: '#eeffee', padding: '10px', marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}

      {/* Add New User Form */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>Add New User</h3>
        <form onSubmit={addUser}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Role:</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Add User'}
          </button>
        </form>
      </div>

      {/* Existing Users */}
      <div>
        <h3>Existing Users</h3>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh List'}
        </button>

        {loading && <p>Loading users...</p>}
        {!loading && users.length === 0 && <p>No users found in the system.</p>}

        {!loading && users.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Role</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userName =
                  user.Attributes?.find((attr) => attr.Name === 'name')?.Value || 'N/A';
                const userEmail =
                  user.Attributes?.find((attr) => attr.Name === 'email')?.Value ||
                  user.Username ||
                  'N/A';
                const userRole =
                  user.Role ||
                  user.Attributes?.find((attr) => attr.Name === 'custom:role')?.Value ||
                  'survey-taker';

                return (
                  <tr key={user.Username} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{userName}</td>
                    <td>{userEmail}</td>
                    <td>
                      <select
                        value={userRole}
                        onChange={(e) => handleRoleChange(userEmail, e.target.value)}
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Apply the current role for ${userName}?`
                            )
                          ) {
                            updateUserRole(userEmail, userRole);
                          }
                        }}
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserRoleManagement;