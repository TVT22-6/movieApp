import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import RegistrationForm from "./SignIn";
import DeleteUser from "./DeleteUser";
import MovieCard from "./MovieCard";
import { Login } from "./components/Auth";
import { PasswordChangeForm } from "./components/passW";
import { jwtToken, userData } from "./components/Signals";
import Review from "./components/Review";
import Group from "./group";
import Actor from "./actor";
import MovieSearch from "./components/MovieSearch";
import ReviewForm from "./components/ReviewForm";
import UserPage from "./components/UserPage";

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("home"); // Aktiivisen välilehden tila
  const [theme, setTheme] = useState("light");
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSearchMovies = async (title) => {
    searchMovies(title);
  };

  const handleMovieClick = (selectedMovie) => {
    // Do any additional logic you need with the selected movie
    // Set the state to show the ReviewForm
    setShowReviewForm(true);
    setActiveTab("ReviewForm");
    console.log("setShowReviewForm");
  };

  return (
    <div>
      <div className="navbar">
        <Navbar setActiveTab={setActiveTab} handleLogout={handleLogout} />
      </div>
      <div className={`app ${theme}`}>
        <button onClick={handleToggleTheme}>Toggle Theme</button>
        {/* Nappulat välilehtien vaihtamiseen */}
        <div>
          <button onClick={() => setActiveTab("Review")}>Review</button>
          <button onClick={() => setActiveTab("home")}>Home</button>
          <button onClick={() => setActiveTab("actors")}>Actors</button>
          <button onClick={() => setActiveTab("user")}>User</button>
          <button onClick={() => setActiveTab("Group")}>Groups</button>
          <button onClick={() => setActiveTab("auth")}>
            {jwtToken.value.length === 0 ? "Log In" : "Log Out"}
          </button>
        </div>
        {/* Ehdollinen sisältö aktiivisen välilehden perusteella */}
        {activeTab === "home" && (
          <div>
            <MovieSearch onSearch={handleSearchMovies} />
            {movies.length > 0 ? (
              <div className="container">
                {movies.map((movie, index) => (
                  <MovieCard
                    key={index}
                    movie={movie}
                    onMovieClick={handleMovieClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>No movies found</h2>
              </div>
            )}
          </div>
        )}
        {/*Open actros tab*/}
        {activeTab === "actors" && (
          <div>
            <h2>Actors</h2>
            <Actor />
          </div>
        )}{" "}
        {/*Open actros tab*/}
        {activeTab === "ReviewForm" && (
          <div>{showReviewForm && <ReviewForm />}</div>
        )}
        {/*Open reviw tab */}
        {activeTab === "Review" && (
          <div>
            <Review />
          </div>
        )}
        {/*Open userPage tab */}
        {activeTab === "user" && (
          <div>
            <UserPage />
          </div>
        )}
        {/* Login window, which contains the SignIn and DeleteUser functions */}
        {activeTab === "auth" && (
          <div>
            {jwtToken.value.length === 0 ? (
              <div>
                <Login /> {/* Rendered when no user is logged in */}
                <RegistrationForm />
              </div>
            ) : (
              <div>
                <button onClick={handleLogout} className="red-button">
                  Log Out
                </button>{" "}
                {/* Rendered when a user is logged in */}
                <PasswordChangeForm />
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
