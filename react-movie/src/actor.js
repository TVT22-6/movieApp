import React, { useState, useEffect } from "react";
import ActorCard from "./components/ActorCard";
import ReviewFormForActor from "./components/ReviewFormForActor";


const Actor = () => {
  const [movies, setMovies] = useState([]);
  const [fetchMovie, setFetchMovie] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorReviews, setActorReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("ActorList");
  const [topRatedActors, setTopRatedActors] = useState(null);

  const API_URL = "https://www.omdbapi.com?apikey=d4f64de4";

  useEffect(() => {
    if (selectedActor) {
      fetchActorReviews();          // Execute fetchactors when selectedactors is provided
    }
  }, [selectedActor]);

  const searchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        setMovies(data.Search);
        setActors([]);                // Clear previous actors when searching for new movies
        setSelectedMovie(null);       // Clear selected movie when searching
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
    if (searchTerm.trim() === "") {           // If the search term is empty, do nothin
      return;
    }
    searchMovies(searchTerm);
    setSelectedMovie(null);
    setSelectedActor(null);
  };


  const fetchActorReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/getActorReviews/${selectedActor}`);

      if (!response.ok) {
        console.error(`HTTP Error! Status: ${response.status}`);
        return;
      }
      const actorReviewData = await response.json();
    
      if (actorReviewData && actorReviewData.actorReviews.length > 0) {
        setActorReviews(actorReviewData.reviewsAll);
        setActorReviews(actorReviewData.actorReviews);
      }
    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    } 
  };

  const fetchTopRatedActors = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/getTopRatedActors");
  
      if (!response.ok) {
        console.error(`HTTP Error! Status: ${response.status}`);
        return;
      }
  
      const topRatedActorsData = await response.json();
  
      if (topRatedActorsData && topRatedActorsData.topRatedActors.length > 0) {
        console.log("Top Rated Actors:", topRatedActorsData.topRatedActors);
        // Handle the top-rated actors data as needed
        setTopRatedActors(topRatedActorsData.reviewsAll);
        setTopRatedActors(topRatedActorsData.topRatedActors);
        setActiveTab("TopRatedActors");
      } else {
        console.log("No top-rated actors found");
      }
    } catch (error) {
      console.error("Error fetching top-rated actors:", error);
    }
  };

  const handleTopRatedActorsClick = () => {
    fetchTopRatedActors();
    //setActiveTab("TopRatedActors"); // Set the active tab to "TopRatedActors" when clicked
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
        <button onClick={handleTopRatedActorsClick}>Top Rated Actors</button>

        {activeTab === "TopRatedActors" && topRatedActors && (
          <div>
            <h3>Top Rated Actors:</h3>
            <ul>
              {topRatedActors.map((actor, index) => (
                <li key={index}>
                  {actor.actorname}
                  <br />
                <p>Rating: {parseFloat(actor.avg_votescore).toFixed(1)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedMovie ? (
        <div className="actor">
          {actors.map((actor, index) => (
            <div key={index} className="actor-card">
              <a href="#" onClick={() => handleActorClick(actor, fetchMovie)}> {/* Make actor names clickable */}
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
          setSelectedMovie={setSelectedMovie} 
          setSelectedActor={setSelectedActor} 
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