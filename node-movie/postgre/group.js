const pgPool = require("./connection");
// postgre/group.js
const sql = {
  INSERT_GROUP:
    "INSERT INTO groups (gname, admin) VALUES ($1, $2) RETURNING *;",
  DELETE_GROUP: "DELETE FROM groups WHERE groupid = $1 AND admin = $2",
  DELETE_ROWS: "DELETE FROM groupusers WHERE groupid_usergroups = $1",
  GET_ALL_GROUPS: "SELECT * FROM groups",
  GET_GROUP: "SELECT groupid FROM groups WHERE gname = $1",
  JOIN_GROUP:
    "INSERT INTO groupusers (username, groupid_usergroups) VALUES ($1, $2)",
  SPECIFIC_GROUP:
    "SELECT groupusers.username, groups.gname FROM groups INNER JOIN groupid_usergroups ON groups.groupid = groupid_usergroups.groupid INNER JOIN groupusers ON groupid_usergroups.groupusers = groupusers.groupusers",
};

// Add the `admin` parameter to the addGroup function
async function addGroup(gname, username) {
  const query = {
    text: "INSERT INTO groups (gname, admin) VALUES ($1, $2) RETURNING *;",
    values: [gname, username],
  };

  try {
    const result = await pgPool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding group:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

async function deleteGroup(groupid, admin) {
  await pgPool.query(sql.DELETE_GROUP, [groupid, admin]);
}

async function getAllGroups() {
  const result = await pgPool.query(sql.GET_ALL_GROUPS);
  return result.rows;
}

async function joinGroup(username, groupid_usergroups) {
  console.log("mitä täsä tullee44444", username, groupid_usergroups);
  await pgPool.query(sql.JOIN_GROUP, [username, groupid_usergroups]);
  return { message: "Successfully joined the group" };
}

async function getGroup() {
  try {
    const result = await pgPool.query(sql.SPECIFIC_GROUP);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

async function getCreatedGroup(gname) {
  try {
    const result = await pgPool.query(sql.GET_GROUP, [gname]);
    console.log("mitä täsä tullee3333", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

module.exports = {
  addGroup,
  deleteGroup,
  getAllGroups,
  joinGroup,
  getGroup,
  getCreatedGroup,
};
