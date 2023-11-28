/*import { useState } from "react";
import { jwtToken } from './Signals';
import axios from 'axios';

const ReviewForm = ({ onReviewChange, onSubmitReview }) => {
    const [movieName, setMovieName] = useState('');
    const [localReview, setLocalReview] = useState(''); // Renamed to avoid conflict
    const [rating, setRating] = useState('');
    const [genre, setGenre] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [userName, setUserName] = useState('');


    const handleChange = (event) => {
        // Call the onReviewChange function with the new value and the event
        //onReviewChange(event.target.value, event);
        setLocalReview(event.target.value); // Update local state
        setDatePosted(event.target.value);
        setGenre(event.target.value);
        setMovieName(event.target.value);
        setUserName(event.target.value);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = jwtToken.value;

        if (!token) {
            // Handle the case where the user is not logged in
            console.log('Please log in to add reviews.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        };

        const reviewData = {
            movieName: localMoviename,
            genre: localGenre,
            datePosted: localDate,
            review: localReview, // Use the local state here
            rating: localRating,
            userID: userID
        };

        try {
            const response = await axios.post('http://localhost:3001/user/addReview', reviewData, { headers });

            // Reset the form values
            setMovieName('');
            setGenre('');
            setDatePosted('');
            setLocalReview('');
            setRating('');
            setUserName('');

            // Handle successful submission, if needed
            console.log('Review submitted successfully:', response.data);
        } catch (error) {
            console.error(error);
            // Handle the error, e.g., display an error message
            console.log('Failed to add review:', error.response?.data.error || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ReviewForm" >
            <label htmlFor="review">Review</label>
            <input
                id="review"
                type="text"
                value={localReview}
                onChange={handleChange}
                required
            />
            <input
                id="username"
                type="text"
                value={localUsername}
                onChange={handleChange}
                required
            />
            <input
                id="genre"
                type="text"
                value={localGenre}
                onChange={handleChange}
                required
            />
            <input
                id="moviename"
                type="text"
                value={localMoviename}
                onChange={handleChange}
                required
            />
            <input
                id="date"
                type="text"
                value={localDate}
                onChange={handleChange}
                required
            />


            <label htmlFor="rating">Rating</label>
            <select id="rating" value={localRating} onChange={handleRatingChange} required>
                <option value="">Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ReviewForm;*/
import React, { useState } from 'react';
import { jwtToken } from './Signals';
import axios from 'axios';

const ReviewForm = ({ onReviewChange, onSubmitReview }) => {
    const [movieName, setMovieName] = useState('');
    const [localReview, setLocalReview] = useState('');
    const [rating, setRating] = useState('');
    const [genre, setGenre] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [userName, setUserName] = useState('');

    const [localUsername, setLocalUsername] = useState('');

    const handleChange = (event) => {
        const { id, value } = event.target;

        switch (id) {
            case 'review':
                setLocalReview(value);
                break;
            case 'username':
                setLocalUsername(value);
                break;
            case 'genre':
                setGenre(value);
                break;
            case 'moviename':
                setMovieName(value);
                break;
            case 'date':
                setDatePosted(value);
                break;
            default:
                break;
        }
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = jwtToken.value;

        if (!token) {
            console.log('Please log in to add reviews.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const reviewData = {
            mname: movieName,
            genre: genre,
            date: datePosted,
            content: localReview,
            userVS: rating,
            username: userName // Assuming userName is the userID
        };

        console.log('Review Data:', reviewData);

        try {
            const response = await axios.post('http://localhost:3001/user/addReview', reviewData, { headers });

            setMovieName('');
            setGenre('');
            setDatePosted('');
            setLocalReview('');
            setRating('');
            setUserName('');

            console.log('Review submitted successfully:', response.data);
        } catch (error) {
            console.error(error);
            console.log('Failed to add review:', error.response?.data.error || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ReviewForm">
            <label htmlFor="review">Review</label>
            <input
                id="review"
                type="text"
                value={localReview}
                onChange={handleChange}
                required
            />
            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                value={localUsername}
                onChange={handleChange}
                required
            />
            <label htmlFor="genre">Genre</label>
            <input
                id="genre"
                type="text"
                value={genre}
                onChange={handleChange}
                required
            />
            <label htmlFor="moviname">Movie Name</label>
            <input
                id="moviename"
                type="text"
                value={movieName}
                onChange={handleChange}
                required
            />
            <label htmlFor="date">Date Posted</label>
            <input
                id="date"
                type="text"
                value={datePosted}
                onChange={handleChange}
                required
            />

            <label htmlFor="rating">Rating</label>
            <select id="rating" value={rating} onChange={handleRatingChange} required>
                <option value="">Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>

            <button type="submit">Submit</button>
        </form>
    );
};

export default ReviewForm;
