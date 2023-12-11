import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtToken } from "./components/Signals";
import GroupCard from "./components/groupCard";

const Group = () => {
  const [mode, setMode] = useState("view");
  const [groups, setGroups] = useState([]);
  const [gname, setGroupName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [groupReviews, setGroupReviews] = useState([]);

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

        // Sort groups alphabetically by group name
        const sortedGroups = response.data.data.sort((a, b) =>
          a.gname.localeCompare(b.gname)
        );

        setGroups(sortedGroups);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      // Check if the group with the same name already exists
      const existingGroup = groups.find((group) => group.gname === gname);

      if (existingGroup) {
        setCreationMessage("Group with the same name already exists");
        handleHideMessageTimer(setCreationMessage);
        return;
      }

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
      const createdGroup = createdGroupResponse.data[0];

      console.log("Created group details:", createdGroup);

      // After creating a group, fetch the updated list of groups
      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups"
      );
      setGroups(groupsResponse.data.data);

      // Step 3: Now call handleJoinGroup with the groupid
      await handleJoinGroup(createdGroup.groupid);
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

    // Show the confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (confirmed) {
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
    }
  };

  const handleJoinGroup = async (groupid) => {
    const token = jwtToken.value;
    console.log("handleJoinGroup called", token);

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

  const handleSendRequest = async (groupid) => {
    console.log("handleSendRequest called", groupid);
    const token = jwtToken.value;
    console.log("handleSendRequest called", token);

    if (!token) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("handleSendRequest called", token, "tässä tämä", headers);

    try {
      console.log("jwtToken:", jwtToken);
      // Assuming you have an API endpoint to send join requests
      const response = await axios.post(
        `http://localhost:3001/user/joinRequest/${groupid}`,
        {},
        {
          headers
        }
      );
      console.log("Response 1:", response.data);

      console.log("Response data:", response.data);

      if (response.ok) {
        // Request was successful
        console.log("Join request sent successfully");
        // You can perform additional actions here if needed
      } else {
        // Handle errors
        console.error("Failed to send join request");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("Error sending join request:", error);
    }
  };

  const handleViewGroup = async (groupid) => {
    try {
      // Fetch details for the selected group
      const response = await axios.get(
        `http://localhost:3001/user/getGroup/${groupid}`
      );
      const groupDetails = response.data;

      // Set the selected group details and group id
      setSelectedGroup(groupDetails);
      setSelectedGroupId(groupid);

      // Update the mode to "details"
      setMode("details");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Function to handle "View Groups" button click
  const handleViewGroups = () => {
    // Reset selectedGroupId and hide details
    setSelectedGroupId(null);
    setSelectedGroup(null);

    // Update the mode to "view"
    setMode("view");
  };

  const handleLeaveGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setLeaveMessage("Please log in to leave the group.");
      handleHideMessageTimer(setLeaveMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.delete(
        `http://localhost:3001/user/leaveGroup/${groupid}`,
        { headers }
      );

      console.log("Leave group response:", response.data);
      setLeaveMessage("Successfully left the group");
      handleHideMessageTimer(setLeaveMessage);

      // Fetch the updated list of groups after leaving
      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups",
        { headers }
      );
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setLeaveMessage("Error leaving group");
      handleHideMessageTimer(setLeaveMessage);
    }
  };

  const handleGroupReviews = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setLeaveMessage("Please log in to watch group reviews.");
      handleHideMessageTimer(setLeaveMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Make sure the user is part of the group before fetching reviews
      const response = await axios.get(
        `http://localhost:3001/user/groupReviews/${groupid}`,
        { headers }
      );

      // Assuming the response data is an array of reviews
      const groupReviewsData = response.data;

      // Set the group reviews in the state
      setGroupReviews(groupReviewsData);

      // Update the mode to "groupReviews"
      setMode("groupReviews");
    } catch (error) {
      console.error(error.response?.data || error.message);
      // Handle errors, e.g., show an error message to the user
    }
  };

  return (
    <div className="component-container">
      <div>
        <button onClick={handleViewGroups}>View Groups</button>
        <button onClick={() => setMode("create")}>Create Group</button>
      </div>

      {/* Display content based on the selected mode */}
      <div>
        {mode === "view" && !selectedGroupId && (
          <div>
            <h2>All Groups</h2>
            <ul>
              {groups.map((group) => (
                <li key={group.groupid}>
                  {group.gname}
                  <button onClick={() => handleViewGroup(group.groupid)}>
                    View Group
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {mode === "create" && (
          <div>
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
            {creationMessage && <p>{creationMessage}</p>}
          </div>
        )}
        {mode === "details" && selectedGroup && (
          <div>
            <h2>{selectedGroup.gname} Details</h2>
            <p>Users:</p>
            <ul>
              {selectedGroup.users &&
                selectedGroup.users.map((user) => (
                  <li key={user.username}>{user.username}</li>
                ))}
            </ul>
            {/* Display delete and join buttons */}
            <button onClick={() => handleDeleteGroup(selectedGroupId)}>
              Delete
            </button>
            <button onClick={() => handleSendRequest(selectedGroupId)}>
              Join
            </button>
            {/* Display leave button */}
            <button onClick={() => handleLeaveGroup(selectedGroupId)}>
              Leave Group
            </button>
            <button onClick={() => handleGroupReviews(selectedGroupId)}>
              Group Reviews
            </button>
          </div>
        )}
        {mode === "groupReviews" && groupReviews.length > 0 && (
          <div>
            <h2>Group Reviews</h2>

            <table>
              <tbody>
                {groupReviews.map((review) => (
                  <GroupCard key={review.reviewid} review={review}>
                    <td> {review.username}</td>
                    <td>{review.content}</td>
                    <td>{review.uservotescore}</td>
                    <td>{review.moviename}</td>
                    <td>{review.dateposted}</td>
                  </GroupCard>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display messages */}
        {creationMessage && <p>{creationMessage}</p>}
        {deleteMessage && <p>{deleteMessage}</p>}
        {joinMessage && <p>{joinMessage}</p>}
        {leaveMessage && <p>{leaveMessage}</p>}
      </div>
    </div>
  );
};

export default Group;
