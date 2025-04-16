import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  // Get user details - handle different user sources (Cognito or Google)
  const userInfo = user.attributes;
  const email = userInfo.email;
  const name = userInfo.name || userInfo.email;
  
  // For Google-authenticated users, picture might be available
  const picture = userInfo.picture;

  return (
    <div style={{ 
      padding: '10px', 
      display: 'flex', 
      alignItems: 'center',
      borderRadius: '8px',
      background: '#f5f5f5',
      marginBottom: '20px'
    }}>
      {picture && (
        <img 
          src={picture} 
          alt="Profile" 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%',
            marginRight: '10px'
          }}
        />
      )}
      <div>
        <div style={{ fontWeight: 'bold' }}>{name}</div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>{email}</div>
      </div>
    </div>
  );
};

export default UserProfile;