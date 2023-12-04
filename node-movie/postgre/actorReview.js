const pgPool = require("./connection");

const sql = {
    INSERT_ACTORREVIEW:
      'INSERT INTO "actor" (date, actorname, movie, content, votescore, username) VALUES ($1, $2, $3, $4, $5, $6)',
  };
  
  async function addActorReview(date, actorname, movie, content, votescore, username) {
    try {
      const result = await pgPool.query(sql.INSERT_ACTORREVIEW, [
        date,
        actorname,
        movie,
        content,
        votescore,
        username,
      ]);
  
      console.log("Review inserted successfully in actorReview.js backend:", result.rows[0]);
    } catch (error) {
      console.error("Error inserting review into the database:", error);
    }
  }
  
  module.exports = {
    addActorReview,
  };