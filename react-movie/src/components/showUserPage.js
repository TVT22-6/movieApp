// UserProfile.js
import React from 'react';

const UserProfile = ({ userData }) => {
  // Render the user profile page with userData
  return (
    <div>
      {userData ? (
        <div>
          <h2>{userData.username}'s Profile</h2>
          {/* Display user-specific content here */}
          {/* For example, user's reviews, links, etc. */}
        </div>
      ) : (
        <div>
          <p>Loading user profile...</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
