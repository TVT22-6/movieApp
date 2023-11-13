import React, { useState, useEffect } from "react";
import "./App.css";
import SearchIcon from "./search.svg";
import MovieCard from "./MovieCard";
import { Login } from "./components/Auth";
import { jwtToken, userData } from "./components/Signals";

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("home"); // Aktiivisen välilehden tila

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
  };

  useEffect(() => {
    searchMovies("Spiderman");
  }, []);

  const handleLogout = () => {
    jwtToken.value = ""; // Kirjaudu ulos
    userData.value = null;
    setActiveTab("home"); // Palaa etusivulle uloskirjautumisen jälkeen
  };

  return (
    <div className="app">
      <h1>NWADB</h1>

      {/* Nappulat välilehtien vaihtamiseen */}
      <div>
        <button onClick={() => setActiveTab("Review")}>Review</button>
        <button onClick={() => setActiveTab("home")}>Home</button>
        {jwtToken.value.length === 0 && (
          <button onClick={() => setActiveTab("auth")}>Log In</button>
        )}
        {jwtToken.value.length > 0 && (
          <button onClick={handleLogout}>Log Out</button>
        )}
      </div>

      {/* Ehdollinen sisältö aktiivisen välilehden perusteella */}
      {activeTab === "home" && (
        <div>
          {/* Sisältö Etusivu-välilehdelle */}
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
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No movies found</h2>
            </div>
          )}
        </div>
      )}

      {/* Kirjautumisvälilehden sisältö */}
      {activeTab === "auth" && <Login />}

      {/* Kirjautumisvälilehden sisältö */}
      {activeTab === "Review"}
    </div>
  );
};

export default App;
