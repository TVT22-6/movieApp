// UserSearch.js
import React, { useState } from "react";
import SearchIcon from "../search.svg";
import "../styles/App.css";

// UserSearch.js

const UserSearch = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // New state to store search results

  const handleSearch = async () => {
    console.log("searchTerm:", searchTerm);
    console.log("searchResults:", searchResults);
    console.log("onUserSelect:", onUserSelect);
    try {
      // Perform a search for users based on the searchTerm
      const response = await fetch(
        `http://localhost:3001/user/getSpecificUsers/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("HTTP Error! status: ${response.status}");
      }
      const data = await response.json();
      console.log("API Response:", data);

      // Update the search results state with the fetched data
      setSearchResults(data.users);
    } catch (error) {
      console.error("Error fetching user search results:", error);
    }
  };

  // Rest of the component...

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <img src={SearchIcon} alt="search" onClick={handleSearch} />
      // Display the search results as hyperlinks
      <ul>
        {searchResults.map((user) => (
          <li key={user.username}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onUserSelect(user.username);
              }}
            >
              {user.username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
