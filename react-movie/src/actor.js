import React, { useState } from "react";
import ActorCard from "./components/ActorCard";
import ReviewFormForActor from "./components/ReviewFormForActor";

const Actor = () => {
  const [movies, setMovies] = useState([]);
  const [fetchMovie, setFetchMovie] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [activeTab, setActiveTab] = useState("ActorList");

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
      const movieName = movieData.Title ? movieData.Title.split(", ") : [];

      setActors(movieActors);
      setFetchMovie(movieName);
      console.log(movieName);
      console.log("Actors:", movieActors);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovie(imdbID);
    searchActors(imdbID);

    setActiveTab("ReviewFormForActor");
  };

  const handleActorClick = (actor, fetchMovie) => {
    setSelectedActor(actor);
    setSelectedMovie(fetchMovie);
    setActiveTab("ReviewFormForActor");
  };

  const handleSearchMovies = async () => {
    searchMovies(searchTerm);
    // Reset selectedMovie and selectedActor when searching for new movies
    setSelectedMovie(null);
    setSelectedActor(null);
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
              {/* Make actor names clickable */}
              <a href="#" onClick={() => handleActorClick(actor, fetchMovie)}>
                {actor}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Search for movies to see actors</h2>
          {/* Display movie search results */}
          <div className="container">
            {movies.map((movie, index) => (
              <ActorCard
                key={index}
                movie={movie}
                onMovieClick={() => handleMovieClick(movie.imdbID)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "ReviewFormForActor" && (
        <ReviewFormForActor
          selectedActor={selectedActor}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie} // Pass the setter function to update selectedMovie in ReviewFormForActor
          setSelectedActor={setSelectedActor} // Pass the setter function to update selectedActor in ReviewFormForActor
        />
      )}
    </div>
  );
};

export default Actor;