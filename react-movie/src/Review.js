import React, { useState, useEffect } from "react";

const Review = () => {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("alphabetical");

  useEffect(() => {
    const fetchReviewedMovies = async () => {
      try {
        const response = await fetch("http://localhost:3001/user/getAll");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const dataText = await response.text(); // Get raw text response
        console.log("Raw API Response:", dataText);
        const data = JSON.parse(dataText); // Try parsing the response
        setMovies(data.reviewsAll);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchReviewedMovies();
  }, []);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getSortedMovies = () => {
    const sortedMovies = [...movies];

    if (sortBy === "alphabetical") {
      sortedMovies.sort((a, b) => a.moviename.localeCompare(b.moviename));
    } else if (sortBy === "genre") {
      sortedMovies.sort((a, b) => a.genre.localeCompare(b.genre));
    } else if (sortBy === "uservotescore") {
      sortedMovies.sort((a, b) => b.uservotescore - a.uservotescore);
    }

    return sortedMovies;
  };

  return (
    <div>
      <h2>Reviewed Movies</h2>
      <label>
        Sort by:
        <select value={sortBy} onChange={handleSortChange}>
          <option value="alphabetical">Alphabetical</option>
          <option value="genre">Genre</option>
          <option value="uservotescore">User Vote Score</option>
        </select>
      </label>

      <ul>
        {getSortedMovies().map((movie) => (
          <li key={movie.id}>
            <div>
              <h3>{movie.moviename}</h3>
              <p>Genre: {movie.genre}</p>
              <p>User Vote Score: {movie.uservotescore}</p>
              <p>Review: {movie.content}</p>
              <p>Date: {movie.dateposted}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Review;
