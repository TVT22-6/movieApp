import React, { useState, useEffect } from 'react';
import './App.css';
import SearchIcon from './search.svg';
import MovieCard from './MovieCard';
import { Login } from './components/Auth'; // Adjust the path as necessary
import { jwtToken, userData } from './components/Signals';

const API_URL = 'http://www.omdbapi.com?apikey=d4f64de4';

// const movie1 = {
//   "Title": "Spiderman",
//   "Year": "2010",
//   "imdbID": "tt1785572",
//   "Type": "movie",
//   "Poster": "N/A"
// }

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
  };

  useEffect(() => {
    searchMovies('Spiderman');
  }, []);

  const handleLogout = () => {
    jwtToken.value = ''; // Clear the token which effectively logs the user out
    userData.value = null; // Clear user data
  };

  return (
    <div className="app">
      <h1>NWADB</h1>
      {/* Display login or logout button based on jwtToken */}
      {jwtToken.value.length === 0 ? (
        <Login />
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}

      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} /> // Ensure MovieCard is properly defined or imported
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;