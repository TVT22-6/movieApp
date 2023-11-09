import React, { useState } from 'react';
import { MovieList } from './functions';
import { useEffect } from 'react';
import './App.css'
import SearchIcon from './search.svg'
import MovieCard from './MovieCard';

// Import from functions.js

// ReadMe - React1 video käy läpi tämän ja muiden tiedostojen sisällön

/*
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Implement your login logic here, e.g., check user credentials, set tokens, etc.
    setIsLoggedIn(true); // Update the state when logged in
  };

  const handleLogout = () => {
    // Implement your logout logic here, e.g., clear tokens, reset user data, etc.
    setIsLoggedIn(false); // Update the state when logged out
  };

return (
  <div>
    <header>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </header>

    {isLoggedIn ? (
      <div>
        <h1>Welcome to the Movie App</h1>
        <MovieList />
        <MovieList />
        <MovieList />
      </div>
    ) : (
      <p>Please log in to view the movies...  -Edit this code in: src/app.js</p>
    )}
  </div>
);
}*/

const API_URL = 'http://www.omdbapi.com?apikey=d4f64de4'

const movie1 = {
  "Title": "Spiderman",
  "Year": "2010",
  "imdbID": "tt1785572",
  "Type": "movie",
  "Poster": "N/A"
}

const App = () => {

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  }


  useEffect(() => {

    searchMovies('Spiderman')

  }, []);

  return (
    <div className="app">
      <h1>NWADB</h1>
      <div className="search">
        <input placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies?.length > 0
        ? (<div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} />
          ))}
        </div>
        ) : (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )};
    </div>
  );
}


export default App;
