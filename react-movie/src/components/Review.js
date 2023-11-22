import React, { useState, useEffect } from "react";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [orderBy, setOrderBy] = useState("alphabetical");

  useEffect(() => {
    // Fetch reviews when the component mounts
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Fetch reviews based on the current order
      const response = await fetch("http://localhost:3001/user/getAll");
      const data = await response.json();

      console.log(data); // Log the data to inspect its structure

      // Assuming the array of reviews is directly in the response
      setReviews(data.reviewsAll);
      console.log("Reviews state:", reviews);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  /*const forceRender = () => {
  if (Array.isArray(reviews)) {
    setReviews([...reviews]);
  }
};*/

    const sortedReviews  = () => {
        const sortedReviewsAll = [...reviews];
        if(orderBy === "alphabetical"){
        sortedReviewsAll.sort((a, b) => a.moviename.localeCompare(b.moviename));
    } else if (orderBy === "genre") { 
        sortedReviewsAll.sort((a, b) => a.genre.localeCompare(b.genre));
    } else if (orderBy === "uservotescore") {
        sortedReviewsAll.sort((a, b) => b.uservotescore - a.uservotescore);
    }
    return sortedReviewsAll};

  const handleOrderByChange = (event) => {
    // Update the order and fetch reviews again
    setOrderBy(event.target.value);
  };

  console.log("11",reviews); // Log the reviews to inspect its structure

  

  return (
    <div>
      <h2>Reviews</h2>
      <label>
        Order By:
        <select value={orderBy} onChange={handleOrderByChange}>
          <option value="alphabetical">Alphabetical</option>
          <option value="genre">Genre</option>
          <option value="uservotescore">User Vote Score</option>
        </select>
      </label>

      {reviews.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Genre</th>
              <th>Date Posted</th>
              <th>Content</th>
              <th>User Vote Score</th>
            </tr>
          </thead>
          <tbody>
  {sortedReviews().map((review) => (
    <tr key={review.reviewid}>
      <td>{review.moviename || "N/A"}</td>
      <td>{review.genre || "N/A"}</td>
      <td>{review.dateposted || "N/A"}</td>
      <td>{review.content || "N/A"}</td>
      <td>{review.uservotescore || "N/A"}</td>
      <td>{review.userid || "N/A"}</td>
      {console.log("14", review)}
    </tr>
  ))}
</tbody>
        </table>
      ) : (
        <p>
            {console.log("13",reviews)}
            No reviews found.</p>
      )}
      {console.log("12",reviews)}
    </div>
  )
}

export default Review;
