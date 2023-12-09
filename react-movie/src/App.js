import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import { Login } from "./components/Auth";
import DeleteUser from "./DeleteUser";

import MovieSearch from "./components/MovieSearch";
import MovieCard from "./MovieCard";

import Review from "./components/Review";
import ReviewForm from "./components/ReviewForm";

import Actor from "./actor";
import Group from "./group";
import UserPage from "./components/UserPage";
import UserProfile from "./components/showUserPage";
import UserSearch from "./components/userSearch";
import { jwtToken, userData } from "./components/Signals";

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

  const App = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [genre, setGenre] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [theme, setTheme] = useState("light");


    const searchMovies = async (title) => {
      try {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        console.log("API Response:", data);
        let imdbID = data.Search[0].imdbID;
        console.log("imdbID ekassa:", imdbID);
  
        if (data.Response === "True" && data.Search && data.Search.length > 0) {
          setMovies(data.Search);
          setGenre([]); // Clear previous genre when searching for new movies
          setSelectedMovie(null); // Clear selected movie when searching
        } else {
          setMovies([]);
          setGenre([]);
          setSelectedMovie(null);
          console.log("No movies found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const searchGenre = async ({ imdbID, movieName }) => {
      try {
        console.log("imdbID searchGenressä:", imdbID);
        const movieResponse = await fetch(`${API_URL}&i=${imdbID}`);
        const movieData = await movieResponse.json();
  
        console.log("Movie Details:", movieData);
  
        const movieGenre = movieData.Genre ? movieData.Genre.split(", ") : [];
        const fetchedMovieName = movieData.Title ? movieData.Title : [];
        console.log("Movie name imdb:", fetchedMovieName);
  
        setGenre(movieGenre);
        console.log("Genre:", movieGenre);
  
        const genreString = movieGenre.join(", ");
  
        return genreString; // Return the genres
      } catch (error) {
        console.error("Error fetching data:", error);
        return ""; // Return an empty array in case of an error
      }
    };

  useEffect(() => {
    searchMovies("Spiderman");
  }, []);
  

  const handleLogout = () => {
    jwtToken.value = "";
    userData.value = null;
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };


  const handleMovieClick = async (movieInfo) => {
    const genres = await searchGenre(movieInfo);
    setSelectedMovie({ ...movieInfo, genres });
    setShowReviewForm(true);
  };


  return (
    <Router>
      <Navbar handleLogout={handleLogout} setTheme={setTheme} />
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/home" element={
            <div>
              <MovieSearch onSearch={searchMovies} />
              <div className="movie-list">
                {movies.map((movie, index) => (
                  <MovieCard key={index} movie={movie} onMovieClick={() => handleMovieClick(movie)} />
                ))}
              </div>
              {showReviewForm && selectedMovie && <ReviewForm selectedMovie={selectedMovie} />}
            </div>
          } />
          <Route path="/actors" element={<Actor />} />
          <Route path="/review" element={<Review />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/group" element={<Group />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/getUser" element={<UserSearch />} />
          <Route path="/getUser/:username" element={<UserProfile />} />
          <Route path="/auth" element={jwtToken.value.length === 0 ? <Login /> : <DeleteUser />} />
          {/* Additional routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;