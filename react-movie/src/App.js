import React, { useState } from 'react';
import { MovieList } from './functions'; // Import from functions.js

// ReadMe - React1 video käy läpi tämän ja muiden tiedostojen sisällön


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
}



export default App;
