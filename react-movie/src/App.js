import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import UserProfile from "./components/showUserPage";
import UserSearch from "./components/userSearch";

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("home"); // Aktiivisen välilehden tila
  const [theme, setTheme] = useState("light");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genre, setGenre] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
      return ''; // Return an empty array in case of an error
    }
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

  // New function to handle user selection from the search results
  const handleUserSelect = (userSearchResults) => {
    // For simplicity, assuming the first result is selected
    setSelectedUser(userSearchResults[0]);
  };

  const handleMovieClick = async (movieInfo) => {
    // Call searchGenre and get the genres
    const genres = await searchGenre(movieInfo);

    setSelectedMovie({
      ...movieInfo,
      genres: genres,
    });
    console.log("genre handleMovieClickissä:", genres);


    setShowReviewForm(true);
    setActiveTab("ReviewForm");
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
           <button onClick={() => setActiveTab("Profile")}>Profile</button>
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
          <div>{showReviewForm && <ReviewForm selectedMovie={selectedMovie} />}</div>
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
        {/*Open userPage tab */}
        {activeTab === "Profile" && (
          <div>
           <Router>
             <Routes>
                <Route path="/getSpecificUser/:username" element={<UserProfile userData={selectedUser} />} />
               <Route path="/" element={<UserSearch onUserSelect={handleUserSelect} />} />
              </Routes>
            </Router>
              <UserProfile userData={userData.value} />
          </div>
        )}
        {/*Open userPage tab */}
      
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
