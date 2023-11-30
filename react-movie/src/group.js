import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtToken } from "./components/Signals";

const Group = () => {
  const [mode, setMode] = useState("view");
  const [groups, setGroups] = useState([]);
  const [gname, setGroupName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const token = jwtToken.value;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleHideMessageTimer = (setterFunction) => {
    setTimeout(() => {
      setterFunction(""); // Clear the message after a certain time
    }, 5000); // Adjust the time (in milliseconds) as needed
  };

  useEffect(() => {
    // Fetch groups when the component mounts
    const fetchGroups = async () => {
      const token = jwtToken.value;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get("http://localhost:3001/user/groups", {
          headers,
        });
        setGroups(response.data.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      // Step 1: Create the group
      const response = await axios.post(
        "http://localhost:3001/user/postGroup",
        { gname },
        { headers }
      );

      console.log("Group created successfully:", response.data);
      setCreationMessage("Group created successfully");
      handleHideMessageTimer(setCreationMessage);

      // Step 2: Fetch the group details, including groupid, from the server
      const createdGroupResponse = await axios.get(
        `http://localhost:3001/user/getCreatedGroup/${gname}`
      );

      // Access the group details, including groupid
      const createdGroup = createdGroupResponse.data[0]; // Modify this line

      console.log("Created group details:", createdGroup);

      // After creating a group, fetch the updated list of groups
      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups"
      );
      setGroups(groupsResponse.data.data);

      // Step 3: Now call handleJoinGroup with the groupid
      await handleJoinGroup(createdGroup.groupid);
      console.log("handleJoinGroup called", createdGroup.groupid);
    } catch (error) {
      console.error("Create Group Error:", error);
      console.error(error.response?.data || error.message);
    }
  };

  const handleDeleteGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setDeleteMessage("Please log in to delete a group.");
      handleHideMessageTimer(setDeleteMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Step 1: Check if the user is the owner of the group
      const response = await axios.post(
        `http://localhost:3001/user/deleteGroup/${groupid}`,
        {},
        { headers }
      );

      console.log("Response data:", groupid, headers, response.data);

      // Step 2: If the user is the owner, update the state and show success message
      setDeleteMessage("Group deleted successfully");
      handleHideMessageTimer(setDeleteMessage);

      // Step 3: After deleting a group, fetch the updated list of groups
      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups",
        { headers }
      );
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setDeleteMessage("Error deleting group");
      handleHideMessageTimer(setDeleteMessage);
      console.log(
        "Error deleting group:",
        groupid,
        headers,
        error.response?.data
      );
    }
  };

  const handleJoinGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setJoinMessage("Please log in to join a group.");
      handleHideMessageTimer(setJoinMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("handleJoinGroup called", token, "tässä tämä", headers);

    try {
      console.log("jwtToken:", jwtToken);

      // Check if the user is already a member of the group
      const checkMembershipResponse = await axios.get(
        `http://localhost:3001/user/getGroup/${groupid}`,
        { headers }
      );

      /*const isMember = checkMembershipResponse.data.groupDetails.some(
        (member) => member.username === jwtToken.value.username
      );
      console.log("isMember:", isMember);

      if (isMember) {
        setJoinMessage("You are already a member of this group.");
        handleHideMessageTimer(setJoinMessage);
        return;
      }
      console.log("isMember:", isMember);*/

      // Continue with joining the group
      const response = await axios.post(
        `http://localhost:3001/user/joinGroup/${groupid}`,
        {},
        { headers }
      );

      console.log("Response data:", response.data);
      setJoinMessage("Group joined successfully");
      handleHideMessageTimer(setJoinMessage);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setJoinMessage("Error joining group");
      handleHideMessageTimer(setJoinMessage);
    }
  };

  const handleGroupClick = (groupName) => {
    setSelectedGroup(groupName);
  };

  return (
    <div>
      <div>
        <button onClick={() => setMode("view")}>View Groups</button>
        <button onClick={() => setMode("create")}>Create Group</button>
      </div>

      {/* Display content based on the selected mode */}
      <div>
        {mode === "view" && (
          <>
            <h2>All Groups</h2>
            <ul>
              {groups.map((group) => (
                <li key={group.groupid}>
                  {group.gname}
                  <button onClick={() => handleDeleteGroup(group.groupid)}>
                    Delete
                  </button>
                  <button onClick={() => handleJoinGroup(group.groupid)}>
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {mode === "create" && (
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
        {joinMessage && <p>{joinMessage}</p>}
      </div>
    </div>
  );
};

export default Group;
