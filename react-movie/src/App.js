// App.js
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RegistrationForm from "./SignIn";
import DeleteUser from "./DeleteUser";
import MovieCard from "./MovieCard";
import { Login } from "./components/Auth";
import { jwtToken, userData } from "./components/Signals";
import Review from "./Review";
import Group from "./group";
import MovieSearch from "./components/MovieSearch";

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("home"); //Active tab is used to determine which tab is currently active
  const [theme, setTheme] = useState("light");

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
  };

  useEffect(() => {
    searchMovies("Megan Fox");
  }, []);

  const handleLogout = () => {
    jwtToken.value = "";
    userData.value = null;
    setActiveTab("home");
  };

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSearchMovies = async (title) => {
    searchMovies(title);
  };

  return (
    <div>
      <div className="navbar">
        <Navbar
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />
      </div>
      <div className={`app ${theme}`}>

        <button onClick={handleToggleTheme}>Toggle Theme</button>

        {/* Nappulat välilehtien vaihtamiseen */}
        <div>
          <button onClick={() => setActiveTab("Review")}>Review</button>
          <button onClick={() => setActiveTab("home")}>Home</button>
          <button onClick={() => setActiveTab('actors')}>Actors</button>
          <button onClick={() => setActiveTab("auth")}>
            {jwtToken.value.length === 0 ? "Log In" : "Log Out"}
          </button>
        </div>

        {activeTab === "home" && (
          <div>
            <MovieSearch onSearch={handleSearchMovies} />
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
        {activeTab === 'actors' && (
          <div>
            <h2>Actors</h2>
            {/* Add content related to actors here */}
          </div>
        )}
        {/*Open reviw tab */}
        {activeTab === "Review" && (
          <div>
            <Review />
          </div>)};

        {/* Login window, which contains the SignIn and DeleteUser functions */}
        {activeTab === "auth" && (
          <div>
            {jwtToken.value.length === 0 ? (
              <div>
                <Login />  {/* Rendered when no user is logged in */}
                <RegistrationForm />
              </div>
            ) : (
              <div>
                <button onClick={handleLogout} className="red-button" >Log Out</button> {/* Rendered when a user is logged in */}
                <DeleteUser />
              </div>
            )}
          </div>
        )}


        {activeTab === "Group" && (
          <div>
            <h2>Groups</h2>
            {/* Add content related to groups here */}
            <Group />
          </div>
        )}
      </div>
    </div>
  );

};

export default App;
