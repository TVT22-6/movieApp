import React, { useState, useEffect } from "react";
import Movie from "./Movie";
import { jwtToken, userData } from "./components/Signals";

//const API_URL = 'http://www.omdbapi.com?apikey=d4f64de4';

const Review = () => {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("alphabetical");

  useEffect(() => {
    // Fetch reviewed movies from your database and set them in the 'movies' state.
    // Replace the following placeholder code with your actual data fetching logic.
    const fetchReviewedMovies = async () => {
      try {
        // Replace with your API call to fetch reviewed movies from your database
        const response = await fetch("http://localhost:3000");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchReviewedMovies();
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedMovies = [...movies];

  if (sortBy === "alphabetical") {
    sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "top-rated") {
    sortedMovies.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div>
      <h2>Reviewed Movies</h2>
      <label>
        Sort by:
        <select value={sortBy} onChange={handleSortChange}>
          <option value="alphabetical">Alphabetical</option>
          <option value="top-rated">Top Rated</option>
        </select>
      </label>

      <ul>
        {sortedMovies.map((movie) => (
          <li key={movie.id}>
            <div>
              <h3>{movie.title}</h3>
              <p>Rating: {movie.rating}</p>
              <p>Review: {movie.review}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Review;
