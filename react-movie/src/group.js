// Group.js

import React, { useState } from 'react';
import axios from 'axios';
import { jwtToken } from "./components/Signals";

const Group = () => {
  const [gname, setGroupName] = useState('');

  const handleCreateGroup = () => {
    axios.post('http://localhost:3001/create-group', { gname }, {
      headers: {
        Authorization: jwtToken.value, // Send the user ID in the authorization header
      },
    })
      .then((response) => {
        console.log(response.data);
        // Handle success, e.g., show a success message or update the UI
      })
      .catch((error) => {
        console.error(error.response.data);
        // Handle error, e.g., show an error message to the user
      });
  };

  return (
    <div>
      <h2>Create Group</h2>
      <div>
        <label>Group Name:</label>
        <input type="text" value={gname} onChange={(e) => setGroupName(e.target.value)} />
      </div>
      <button type="button" onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
};

export default Group;
