import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Group = () => {
  const [mode, setMode] = useState('view');
  const [groups, setGroups] = useState([]);
  const [gname, setGroupName] = useState('');
  const [creationMessage, setCreationMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    // Fetch groups when the component mounts
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/groups');
        setGroups(response.data.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/user/postGroup',
        { gname }
      );

      console.log(response.data);
      setCreationMessage('Group created successfully');

      // After creating a group, fetch the updated list of groups
      const groupsResponse = await axios.get('http://localhost:3001/user/groups');
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleDeleteGroup = async (groupid) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/user/deleteGroup/${groupid}`
      );
  
      console.log(response.data);
      setDeleteMessage('Group deleted successfully');
  
      // After deleting a group, fetch the updated list of groups
      const groupsResponse = await axios.get('http://localhost:3001/user/groups');
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setDeleteMessage('Error deleting group');
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setMode('view')}>View Groups</button>
        <button onClick={() => setMode('create')}>Create Group</button>
      </div>

      {/* Display content based on the selected mode */}
      <div>
        {mode === 'view' && (
          <>
            <h2>All Groups</h2>
            <ul>
              {groups.map((group) => (
                <li key={group.groupid}>
                  {group.gname}
                  <button onClick={() => handleDeleteGroup(group.groupid)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {mode === 'create' && (
          <>
            <h2>Create Group</h2>
            <div>
              <label>Group Name:</label>
              <input
                type="text"
                value={gname}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleCreateGroup}>
              Create Group
            </button>

            {/* Display creation message to the user */}
            {creationMessage && <p>{creationMessage}</p>}
          </>
        )}

        {/* Display delete message */}
        {deleteMessage && <p>{deleteMessage}</p>}
      </div>
    </div>
  );
};

export default Group;
