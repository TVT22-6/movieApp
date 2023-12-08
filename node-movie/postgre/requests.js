const pgPool = require("./connection");

const sql = {
  POST_REQUEST:
    "INSERT INTO join_requests (group_id, username, admin) VALUES ($1, $2, $3)",
  GET_REQUEST:
    'SELECT * FROM join_requests WHERE group_id = $1 AND status = "pending" AND admin_username = $2',
  UPDATE_REQUEST:
    'UPDATE join_requests SET status = "accepted" WHERE request_id = $1',
  DELETE_REQUEST: "DELETE FROM join_requests WHERE request_id = $1",
};

async function postRequest(group_id, username, admin) {
  try {
    const result = await pgPool.query(sql.POST_REQUEST, [
      group_id,
      username,
      admin,
    ]);
    console.log(
      "Request inserted successfully in request.js backend:",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error inserting request into the database:", error);
  }
}

async function getRequest(group_id, admin_username) {
  try {
    const result = await pgPool.query(sql.GET_REQUEST, [
      group_id,
      admin_username,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error getting requests:", error);
    return null;
  }
}

async function updateRequest(request_id) {
  try {
    const result = await pgPool.query(sql.UPDATE_REQUEST, [request_id]);
    console.log(
      "Request updated successfully in request.js backend:",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error updating request:", error);
  }
}

async function deleteRequest(request_id) {
  try {
    const result = await pgPool.query(sql.DELETE_REQUEST, [request_id]);
    console.log(
      "Request deleted successfully in request.js backend:",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error deleting request:", error);
  }
}

module.exports = {
  postRequest,
  getRequest,
  updateRequest,
  deleteRequest,
};
