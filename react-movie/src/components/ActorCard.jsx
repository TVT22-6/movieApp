import React from 'react';

const ActorCard = ({ movie, onMovieClick }) => {
  const handleClick = (event) => {
    // Call the onMovieClick function with the movie's IMDb ID and the event
    onMovieClick(event, movie.imdbID);
  };

  return (
    <div className="movie" onClick={handleClick}>
      <div>
        <p>{movie.Year}</p>
      </div>
      <div>
        <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'} alt={movie.Title} />
      </div>
      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
      </div>
    </div>
  );
}

export default ActorCard;