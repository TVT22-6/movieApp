import React, { useState } from 'react';
import { jwtToken } from './Signals';
import axios from 'axios';

const ReviewForm = ({ selectedMovie }) => {
    console.log('Selected Movie review form:', selectedMovie);
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
        const movieName = selectedMovie.Title || '';
        const currentdate = new Date();
        const datePosted = currentdate.toISOString().slice(0, 10);
        const genre = selectedMovie.genres || '';
        const reviewData = {
            mname: movieName,
            genre: genre,
            date: datePosted,
            content: localReview,
            userVS: rating,
        };

        console.log('Review Data:', reviewData);

        try {
            const response = await axios.post('http://localhost:3001/user/addReview', reviewData, { headers });

            //setGenre('');
            setLocalReview('');
            setRating('');

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
