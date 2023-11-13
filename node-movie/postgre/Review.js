const pgPool = require("./connection");

const sql = {
  INSERT_REVIEW:
    'INSERT INTO "Review" (moviename,genre,dateposted,content, uservotescore) VALUES ($1, $2, $3, $4, $5)',
  GET_REVIEW: "SELECT mname FROM Review",
  GET_ALL_BY_MOVIE: "SELECT * FROM Review WHERE mname=$1",
};

async function addReview(moviename, genre, dateposted, content, uservotescore) {
  try {
    await pgPool.query(sql.INSERT_REVIEW, [
      moviename,
      genre,
      dateposted,
      content,
      uservotescore,
    ]);
    console.log("Review inserted successfully.");
  } catch (error) {
    console.error("Error inserting review into the database:", error);
  }
}

// Get all reviews
async function getReview() {
  try {
    const result = await pgPool.query(sql.GET_REVIEW);
    const reviews = result.rows.map((row) => row.moviename);
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews from the database:", error);
    return [];
  }
}

// Get content for a specific movie
async function getAllByMovie(moviename) {
  try {
    const result = await pgPool.query(sql.GET_ALL_BY_MOVIE, [moviename]);
    return result.rows[0].content;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

module.exports = {
  addReview,
  getReview,
  getAllByMovie,
};
