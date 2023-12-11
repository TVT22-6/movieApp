const pgPool = require("./connection");

const sql = {
    INSERT_ACTORREVIEW:
      'INSERT INTO "actor" (date, actorname, movie, content, votescore, username) VALUES ($1, $2, $3, $4, $5, $6)',
    GET_ACTORREVIEWS: 'SELECT * FROM "actor" WHERE actorname = $1', // Update this line
    GET_ALL: 'SELECT * FROM "actor"',
    GET_USER_ACTOR: 'SELECT * FROM "actor" WHERE username = $1',
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

  async function getUserActor(username) {
    try {
      const result = await pgPool.query(sql.GET_USER_ACTOR, [username]);
      return result.rows;
    } catch (error) {
      console.error("Error getting actor reviews:", error);
      return null;
    }
  }

  async function getActorReviews(actorname) {
    try {
      const result = await pgPool.query(sql.GET_ACTORREVIEWS, [actorname]);
      const actorReviews = result.rows;
      console.log(actorname);
      //console.log("Actor Reviews:", actorReviews); // Log the actorReviews
      return result.rows;
    } catch (error) {
      console.error("Error fetching actor reviews from the database:", error);
      return [];
    }
  }


  module.exports = {
    addActorReview,
    getUserActor,
    getActorReviews,
  };