import React, { useState, useEffect } from "react";
import ActorCard from "./components/ActorCard";
import ReviewFormForActor from "./components/ReviewFormForActor";
import { useParams } from "react-router-dom";
import axios from "axios";

const Actor = () => {
  const [movies, setMovies] = useState([]);
  const [fetchMovie, setFetchMovie] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorReviews, setActorReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("ActorList");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);

  const API_URL = "https://www.omdbapi.com?apikey=d4f64de4";

  useEffect(() => {
    if (selectedActor) {
      fetchActorReviews();
    }
  }, [selectedActor]);

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

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setActiveTab("ReviewFormForActor");
    
  
  };

  const handleSearchMovies = async () => {
    if (searchTerm.trim() === "") {
      // If the search term is empty, do nothing
      return;
    }
    searchMovies(searchTerm);
    // Reset selectedMovie and selectedActor when searching for new movies
    setSelectedMovie(null);
    setSelectedActor(null);
  };


  const fetchActorReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/getActorReviews/${selectedActor}`);
      console.log(selectedActor);
      
      if (!response.ok) {
        console.error(`HTTP Error! Status: ${response.status}`);
        return;
      }
  
      const actorReviewData = await response.json();
      
  
      console.log("Actor Reviews:", actorReviewData);
      
  
      if (actorReviewData && actorReviewData.actorReviews.length > 0) {
        setActorReviews(actorReviewData.reviewsAll);
        console.log("iffissä1",actorReviewData);
        console.log("iffissä3", actorReviewData.reviewsAll);
        setActorReviews(actorReviewData.actorReviews);
      }
    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    } 
  };

      
      /*const response = await fetch(`http://localhost:3001/getActorReviews/${encodeURIComponent(actorname)}`);
      // Check if the response status is OK (200) before trying to parse JSON
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      // Check if the response content type is JSON
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Unexpected response content type: ${contentType}`);
      }
  
      const data = await response.json();
      console.log("Actor Reviews:", data.reviewsAll);
      setActorReviews(data.reviewsAll);
    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    }*/


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

      {activeTab === "ReviewFormForActor" && selectedMovie && selectedActor &&(
        <div>
        <ReviewFormForActor
          selectedActor={selectedActor}
          selectedMovie={selectedMovie}
          actorReviews={actorReviews}
          setActorReviews={setActorReviews}
          setSelectedMovie={setSelectedMovie} // Pass the setter function to update selectedMovie in ReviewFormForActor
          setSelectedActor={setSelectedActor} // Pass the setter function to update selectedActor in ReviewFormForActor
        />
        <h3>Actor Reviews:</h3>
          {actorReviews && actorReviews.length > 0 ? (
            <ul>
              {actorReviews.map((review, index) => (
                <li key={index}>
                  <p>Movie: {review.movie}</p>
                  <p>Content: {review.content}</p>
                  <p>Vote Score: {review.votescore}</p>
                  <p>User: {review.username}</p>
                  <p>Date: {review.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews available for this actor.</p>
      )}
    </div>
      )}
      </div>
  );
};

export default Actor;