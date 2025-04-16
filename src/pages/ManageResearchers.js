import React, { useState } from 'react';

const ManageResearchers = () => {
  // State for researcher email and name
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [researcherCount, setResearcherCount] = useState(0);

  // Hardcode the projectId as "1" (adjust if needed)
  const projectId = "1";

  // Base API URL for your Lambda
  const baseApiUrl = `https://6tydwlnmqj.execute-api.us-east-2.amazonaws.com/projects/1/researchers`;

  // Add researcher via POST - compatible with your existing Lambda
  const handleAddResearcher = async () => {
    if (!name || !email) {
      setMessage('Please enter both name and email');
      return;
    }

    try {
      const response = await fetch(baseApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name
          // No extra parameters that might confuse the existing Lambda
        })
      });

      if (!response.ok) {
        throw new Error(`POST failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Update the local count of researchers added
      setResearcherCount(prevCount => prevCount + 1);
      
      // Display success message
      setMessage(`Researcher ${email} added to project ${projectId} (${researcherCount + 1})`);
      
      // Clear the form fields after successful addition
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Error adding researcher:', error);
      setMessage(`Error adding researcher: ${error.message}`);
    }
  };

  // Remove researcher via DELETE
  const handleRemoveResearcher = async () => {
    if (!email) {
      setMessage('Please enter an email to remove');
      return;
    }

    try {
      // The DELETE endpoint is /projects/{projectId}/researchers/{researcherId}
      const deleteUrl = `${baseApiUrl}/${email}`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`DELETE failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Display success or custom message from the API
      setMessage(result.message || 'Researcher removed successfully');
      
      // Clear the email field after successful removal
      setEmail('');
    } catch (error) {
      console.error('Error removing researcher:', error);
      setMessage(`Error removing researcher: ${error.message}`);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>Manage Researchers (Project ID: {projectId})</h2>
      
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Researchers added in this session: {researcherCount}
      </p>

      {/* Name Field */}
      <input
        type="text"
        placeholder="Enter Researcher Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: '0.75rem',
          margin: '0.75rem 0',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />

      {/* Email Field */}
      <input
        type="email"
        placeholder="Enter Researcher Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '0.75rem',
          margin: '0.75rem 0',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handleAddResearcher} style={{ padding: '0.75rem 1.25rem' }}>
          Add Researcher
        </button>
        <button onClick={handleRemoveResearcher} style={{ padding: '0.75rem 1.25rem' }}>
          Remove Researcher
        </button>
      </div>

      {/* Status Message */}
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default ManageResearchers;