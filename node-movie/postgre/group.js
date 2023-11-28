const pgPool = require("./connection");
// postgre/group.js
const sql = {
  INSERT_GROUP: "INSERT INTO groups (gname) VALUES ($1) RETURNING *",
  DELETE_GROUP: "DELETE FROM groups WHERE groupid = $1",
  GET_ALL_GROUPS: "SELECT * FROM groups",
  JOIN_GROUP:
    "INSERT INTO groupusers (username, groupid_usergroups) VALUES ($1, $2)",
};

async function addGroup(gname) {
  const result = await pgPool.query(sql.INSERT_GROUP, [gname]);
  return result.rows[0];
}

async function deleteGroup(groupid) {
  await pgPool.query(sql.DELETE_GROUP, [groupid]);
}

async function getAllGroups() {
  const result = await pgPool.query(sql.GET_ALL_GROUPS);
  return result.rows;
}

async function joinGroup(username, groupid_usergroups) {
  await pgPool.query(sql.JOIN_GROUP, [username, groupid_usergroups]);
  return { message: "Successfully joined the group" };
}

module.exports = { addGroup, deleteGroup, getAllGroups, joinGroup };
