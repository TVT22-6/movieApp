import React, { useState, useEffect } from "react";

const Actor = () => {
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "https://www.omdbapi.com?apikey=d4f64de4";

  const searchActors = async (title) => {
    try {
      // Search for movies based on the title
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
  
      console.log("API Response:", data);
  
      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        // Assuming the first movie in the search results
        const firstMovie = data.Search[0];
        
        // Fetch detailed information about the first movie using its IMDb ID
        const movieResponse = await fetch(`${API_URL}&i=${firstMovie.imdbID}`);
        const movieData = await movieResponse.json();
  
        console.log("Movie Details:", movieData);
  
        // Extract actor information from the movie details
        const actors = movieData.Actors ? movieData.Actors.split(", ") : [];
  
        setActors(actors);
        console.log("Actors:", actors);
      } else {
        console.log("No movies found");
        setActors([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    searchActors("Robert Downey Jr.");
  }, []);

  const handleSearchActors = async (name) => {
    searchActors(name);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search actors"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => handleSearchActors(searchTerm)}>Search</button>

      {actors && actors.length > 0 ? (
  <div className="container">
    {actors.map((actor, index) => (
      <div key={index}>
        <h3>{actor}</h3>
      </div>
    ))}
  </div>
) : (
  <div className="empty">
    <h2>{actors.length === 0 ? "No actors found" : "Loading..."}</h2>
  </div>
)}

    </div>
  );
};

export default Actor;