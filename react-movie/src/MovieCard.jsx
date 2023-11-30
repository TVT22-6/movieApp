import React from 'react';



const MovieCard = ({ movie, onMovieClick }) => {

  const onClickHandler = (event) => {
    console.log("on click handlerissa" + movie.imdbID);
    onMovieClick({
      imdbID: movie.imdbID,
      movieName: movie.Title,
    });
  };

  return (
    <div className="movie" onClick={onClickHandler}>
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

export default MovieCard;