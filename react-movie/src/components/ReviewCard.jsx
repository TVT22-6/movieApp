import React from 'react';
import MovieCard from '../MovieCard';
import PosterImg from '../styles/review.png'


const ReviewCard = ({ review, onMovieClick }) => {

    return (
        <MovieCard
            movie={{
                imdbID: review.reviewid,
                Year: review.dateposted, // You can customize this based on your review data
                Poster: PosterImg,  // You may need to customize this
                Type: review.genre,
                Title: review.moviename,
            }}
            onMovieClick={onMovieClick}
        />
    );
};

export default ReviewCard;