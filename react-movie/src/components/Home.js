import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import MovieCard from '../MovieCard';
import ReviewForm from './ReviewForm';

const API_URL = "http://www.omdbapi.com?apikey=d4f64de4";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [genre, setGenre] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const searchMovies = async (title) => {
        try {
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();

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
            const movieResponse = await fetch(`${API_URL}&i=${imdbID}`);
            const movieData = await movieResponse.json();

            const movieGenre = movieData.Genre ? movieData.Genre.split(", ") : [];
            setGenre(movieGenre);

            const genreString = movieGenre.join(", ");

            return genreString; // Return the genres
        } catch (error) {
            console.error("Error fetching data:", error);
            return ""; // Return an empty array in case of an error
        }
    };

    const handleMovieClick = async (movieInfo) => {
        const genres = await searchGenre(movieInfo);
        setSelectedMovie({ ...movieInfo, genres });
        setShowReviewForm(true);
    };

    return (
        <div>
            <MovieSearch onSearch={searchMovies} />
            <div className="movie-list">
                {movies.map((movie, index) => (
                    <MovieCard key={index} movie={movie} onMovieClick={() => handleMovieClick(movie)} />
                ))}
            </div>
            {showReviewForm && selectedMovie && <ReviewForm selectedMovie={selectedMovie} />}
        </div>
    );
};

export default Home;
