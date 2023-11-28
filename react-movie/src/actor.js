import React, { useState } from "react";
import MovieCard from "./MovieCard";

const Actor = () => {
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const API_URL = "https://www.omdbapi.com?apikey=d4f64de4";

  const searchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        setMovies(data.Search);
        setActors([]); // Clear previous actors when searching for new movies
        setSelectedMovie(null); // Clear selected movie when searching
      } else {
        setMovies([]);
        setActors([]);
        setSelectedMovie(null);
        console.log("No movies found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const searchActors = async (imdbID) => {
    try {
      const movieResponse = await fetch(`${API_URL}&i=${imdbID}`);
      const movieData = await movieResponse.json();

      console.log("Movie Details:", movieData);

      const movieActors = movieData.Actors ? movieData.Actors.split(", ") : [];

      setActors(movieActors);
      console.log("Actors:", movieActors);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchMovies = async () => {
    searchMovies(searchTerm);
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovie(imdbID);
    searchActors(imdbID);
  };

  return (
    <div>
      <div className="actor">
        <input
          type="text"
          placeholder="Search movies"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchMovies}>Search</button>
      </div>

      {selectedMovie ? (
        <div className="actor">
          {actors.map((actor, index) => (
            <div key={index} className="actor-card">
              <h3>{actor}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Search for movies to see actors</h2>
          {/* Display movie search results */}
          <div className="container">
            {movies.map((movie, index) => (
              <MovieCard
                key={index}
                movie={movie}
                onMovieClick={() => handleMovieClick(movie.imdbID)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Actor;