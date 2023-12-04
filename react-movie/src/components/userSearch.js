// UserSearch.js
import React, { useState } from "react";
import SearchIcon from "../search.svg";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../styles/App.css";

const UserSearch = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/user/getSpecificUsers/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error("Error fetching user search results:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => handleSearch(onUserSelect)}>Search</button>
      <img
        src={SearchIcon}
        alt="search"
        onClick={() => handleSearch(onUserSelect)}
      />

      <ul>
        {searchResults.map((user) => (
          <li key={user.username}>
            {/* Use Link to navigate to the user profile page */}
            <Link to={`/getUser/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
