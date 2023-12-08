const pgPool = require("./connection");

const sql = {
  POST_REQUEST:
    "INSERT INTO join_requests (groupid, username, admin, status) VALUES ($1, $2, $3, 'pending')",
  GET_REQUEST:
    'SELECT * FROM join_requests WHERE groupid = $1 AND status = "pending" AND admin = $2',
  UPDATE_REQUEST:
    'UPDATE join_requests SET status = "accepted" WHERE request_id = $1',
  DELETE_REQUEST: "DELETE FROM join_requests WHERE request_id = $1",
  GET_ADMIN_BY_GROUPID: "SELECT admin FROM groups WHERE groupid = $1",
};

async function postRequest(groupid, username, admin) {
  try {
    const result = await pgPool.query(sql.POST_REQUEST, [
      groupid,
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

async function getRequest(groupid, admin_username) {
  try {
    const result = await pgPool.query(sql.GET_REQUEST, [
      groupid,
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

async function getAdminUsernameByGroupId(groupid) {
  try {
    const result = await pgPool.query(sql.GET_ADMIN_BY_GROUPID, [groupid]);
    console.log(
      "Admin username retrieved successfully in request.js backend:",
      result.rows
    );
    return result.rows[0]?.admin || null;
  } catch (error) {
    console.error("Error getting admin by groupid:", error);
    return null;
  }
}


module.exports = {
  postRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  getAdminUsernameByGroupId,
};
