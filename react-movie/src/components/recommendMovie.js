import React, { useState } from "react";
import RecommendationCard from "./recommendationCard";

const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Document"];
const releaseYears = ["1980-1989", "1990-1999", "2000-2009", "2010-2019", "2020-present"];

const RecommendMovie = () => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedReleaseYear, setSelectedReleaseYear] = useState("");
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleReleaseYearChange = (event) => {
    setSelectedReleaseYear(event.target.value);
  };

  const handleRecommendation = async () => {
    if (!selectedGenre || !selectedReleaseYear) {
      alert("Please select both genre and release year.");
      return;
    }

    const API_KEY = "d4f64de4"; // Replace with your actual API key
    const API_URL = `https://www.omdbapi.com?apikey=${API_KEY}&s=${selectedGenre}&y=${selectedReleaseYear}&type=movie`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        // Handle recommended movie data as needed
        setRecommendedMovies(data.Search);
        console.log("Recommended Movie:", data.Search[0]);
      } else {
        console.log("No movies found based on the criteria.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Recommend a Movie</h2>
      <div>
        <label>Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="" disabled>Select a genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Release Year:</label>
        <select value={selectedReleaseYear} onChange={handleReleaseYearChange}>
          <option value="" disabled>Select a release year</option>
          {releaseYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {recommendedMovies.map((movie, index) => (
          <RecommendationCard key={index} movie={movie} />
        ))}
      </div>

      <button onClick={handleRecommendation}>Get Recommendation</button>
    </div>
  );
};

export default RecommendMovie;