import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtToken } from "./components/Signals";
import GroupCard from "./components/groupCard";
import SearchIcon from "./search.svg";
import { Link } from "react-router-dom";

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
  const [joinRequests, setJoinRequests] = useState([]);
  const [showJoinRequestWindow, setShowJoinRequestWindow] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showHeader, setShowHeader] = useState(false);


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
    handleViewGroups();
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
    handleViewGroups();
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
      console.log("Group details:", groupDetails);
      console.log("Group details:", groupDetails.groupid);

      // Set the selected group details and group id
      setSelectedGroup(groupDetails);
      setSelectedGroupId(groupid);

      // Update the mode to "details"
      setMode("details");

      handleViewJoinRequests(groupid);


      // Fetch join requests for the group only if the user is an admin


    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleViewJoinRequests = async (groupid) => {
    const token = jwtToken.value;
    console.log("handleViewJoinRequests called", token);
  
    if (!token) {
      return;
    }
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log("handleViewJoinRequests called", token, "tässä tämä", headers);
  
    try {
      console.log("jwtToken:", token);
      const response = await axios.get(
        `http://localhost:3001/user/getRequest/${groupid}`,
        { headers }
      );
  
      console.log("Join requests:", response.data);
  
      // Check if the response data is an array and not empty
      if (Array.isArray(response.data) && response.data.length > 0) {
        const firstItem = response.data[0];
        console.log("Join requests212:", firstItem.groupid);
        console.log("Join requests222:", groupid);
  
        // Check if the groupid in the response matches the expected groupid
        if (firstItem.groupid === groupid) {
          console.log("Join requests111:", firstItem.groupid);
          console.log("Join requests111:", groupid);
  
          // Extract the data from the response
          const joinRequestsData = response.data;
  
          setJoinRequests(joinRequestsData);
          console.log("Join requests112:", joinRequestsData);
          console.log("Join requests113:", joinRequestsData);
  
          // Show join request window if there are join requests
          if (joinRequestsData) {
            console.log("Join requests114:", joinRequestsData);
            setShowJoinRequestWindow(true);
          } else {
            setShowJoinRequestWindow(false);
          }
        } else {
          console.log("Received data does not match the expected groupid.");
          // Handle the case where the groupid does not match
        }
      } else {
        console.log("No data or empty array received.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  
  


  // Function to handle "View Groups" button click

  const handleViewGroups = () => {
    // Reset selectedGroupId and hide details
    setSelectedGroupId(null);
    setSelectedGroup(null);
    setSearchResults(null);

    // Update the mode to "view"
    setMode("view");
    setShowHeader(false);
    setShowJoinRequestWindow(false);

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

  const handleKickUser = async (usernameToKick) => {
    try {
      // Assuming selectedGroupId is the groupid of the selected group
      const groupid = selectedGroupId;
      console.log('groupid:', groupid);
      // Call the kickUser endpoint on the server
      await axios.delete(`http://localhost:3001/user/kickUser/${groupid}/${usernameToKick}`, {
        headers,
      });

      // Fetch updated group information or re-fetch the list of groups
      const groupsResponse = await axios.get("http://localhost:3001/user/groups", { headers });
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleViewGroup(selectedGroupId);
  };

  const handleAcceptRequest = async (request) => {
    console.log("handleAcceptRequest called", request);
    try {
      const response = await axios.post(
        `http://localhost:3001/user/acceptRequest/${request.username}/${request.groupid}`,
        {},
        { headers }
      );

      console.log("Accept request response:", response.data);

      // Update the joinRequests state after accepting the request
      setJoinRequests((prevRequests) =>
        prevRequests.filter((r) => r.username !== request.username)
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleDeleteRequests(request);
    handleViewGroup(request.groupid);

  };

  const handleDeleteRequests = async (request) => {
    console.log("handleDeleteRequests called", request.id);
    try {
      await axios.delete(
        `http://localhost:3001/user/deleteJoinRequest/${request.id}`,
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleViewJoinRequests(request.groupid);
  };



  const handleRejectRequest = async (request) => {
    handleDeleteRequests(request);
  };

  const handleMyGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user/myGroups`,
        { headers }
      );
      const myGroups = response.data;
      setMyGroups(myGroups);


      setMode("myGroups");

      console.log("My groups response:", response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleSearch = async () => {
    setMode("search");
    setShowHeader(true);
    try {
      const response = await fetch(
        `http://localhost:3001/user/searchGroups/${searchTerm}`
      );
      console.log("searchTerm:", searchTerm);
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      const searchResults = await response.json();
      setSearchResults(searchResults);
      setSearchTerm(searchTerm);

      console.log("searchTerm2:", searchTerm);
      console.log("searchResults:", searchResults);
    } catch (error) {
      console.error("Error fetching user search results:", error);
    }
  };


  return (
    <div>
      <div className="search">
        <input
          type="text"
          placeholder="Search for groups"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img src={SearchIcon} alt="search" onClick={handleSearch} />
      </div>
      <div className="component-container">

        <div className="manage-buttons">
          <button onClick={handleViewGroups}>View Groups</button>
          <button onClick={() => setMode("create")}>Create Group</button>
          <button onClick={handleMyGroups}>My Groups</button>
        </div>
        {Array.isArray(searchResults) && (
          <div >
             {showHeader && (

<h2>Search Results</h2>

)}
            <div className='movie-list'>
             
              {searchResults.map((group) => (
                <div key={group.gname} className="actor-card">
                 <h3>{group.gname} </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display content based on the selected mode */}
        <div>
          {mode === "view" && !selectedGroupId && (
            <div>
              <h2>All Groups</h2>
              <div className="movie-list">
                {groups.map((group) => (
                  <div key={group.groupid} className="actor-card">
                    <h3>{group.gname}</h3>
                    <button onClick={() => handleViewGroup(group.groupid)}>
                      View Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
         

          {mode === "create" && (
            <div>
              <h2>Create Group</h2>
              <div>
                <h5>Group Name:</h5>
                <input
                  type="text"
                  value={gname}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <button  type="button" onClick={handleCreateGroup}>
                Create Group
              </button>
              {creationMessage && <p>{creationMessage}</p>}
            </div>
          )}
          {mode === "details" && selectedGroup && (
            <div>
              <div className="manage-buttons">
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
              <h2>{selectedGroup.gname} Details</h2>
              
              <div className="movie-list">
                {selectedGroup.users &&
                  selectedGroup.users.map((user) => (
                    <div key={user.username}  className="actor-card">
                      <h3>{user.username}</h3>
                      <button onClick={() => handleKickUser(user.username)}>
                        Kick User
                      </button>
                    </div>
                  ))}
              </div>
              {/* Display delete and join buttons */}
              
              
              {showJoinRequestWindow && (
                <div>
                  <h2>Join Requests</h2>
                  <div className="movie-list">
                    {joinRequests.map((request) => (
                      <div key={request.id} className="actor-card">
                        <h3>{request.username} wants to join the group. </h3>
                        <button onClick={() => handleAcceptRequest(request)}>
                          Accept
                        </button>
                        <button onClick={() => handleRejectRequest(request)}>
                          Reject
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          {mode === "myGroups" && myGroups && (
            <div>
              <h2>My Groups</h2>
              <div className="movie-list">
                {myGroups.map((group) => (
                  <div  key={group.username} className="actor-card">
                    <h3>{group.gname}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display messages */}
          {creationMessage && <p>{creationMessage}</p>}
          {deleteMessage && <p>{deleteMessage}</p>}
          {joinMessage && <p>{joinMessage}</p>}
          {leaveMessage && <p>{leaveMessage}</p>}
        </div>


      </div>
    </div>
  );

};

export default Group;
