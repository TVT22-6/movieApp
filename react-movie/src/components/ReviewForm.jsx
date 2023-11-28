import { useState } from "react";
import { jwtToken } from './Signals';
import axios from 'axios';

const ReviewForm = ({ onReviewChange, onSubmitReview }) => {
    const [movieName, setMovieName] = useState('');
    const [localReview, setLocalReview] = useState(''); // Renamed to avoid conflict
    const [rating, setRating] = useState('');
    const [genre, setGenre] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [userID, setUserID] = useState('');


    const handleChange = (event) => {
        // Call the onReviewChange function with the new value and the event
        //onReviewChange(event.target.value, event);
        setLocalReview(event.target.value); // Update local state
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
            movieName,
            genre,
            datePosted,
            review: localReview, // Use the local state here
            rating,
            userID,
        };

        try {
            const response = await axios.post('http://localhost:3001/user/addReview', reviewData, { headers });

            // Reset the form values
            setMovieName('');
            setGenre('');
            setDatePosted('');
            setLocalReview('');
            setRating('');
            setUserID('');

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