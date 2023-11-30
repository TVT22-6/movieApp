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
    "SELECT groupusers.username, groups.gname FROM groups INNER JOIN groupusers ON groups.groupid = groupusers.groupid_usergroups",
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

// postgre/group.js

// postgre/group.js

async function deleteGroup(groupid, admin) {
  try {
    // Now check if the admin matches the requesting user
    const isAdminMatch = await checkAdminMatch(groupid, admin);
    if (!isAdminMatch) {
      throw new Error("User does not have permission to delete this group");
    }

    // First, delete rows from the groupusers table
    await pgPool.query(sql.DELETE_ROWS, [groupid]);

    // Then, delete the group from the groups table
    await pgPool.query(sql.DELETE_GROUP, [groupid, admin]);
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
}

// Function to check if the requesting user matches the group admin
async function checkAdminMatch(groupid, admin) {
  const result = await pgPool.query(
    "SELECT * FROM groups WHERE groupid = $1 AND admin = $2",
    [groupid, admin]
  );

  return result.rows.length > 0;
}

async function getDeletedGroup(groupid) {
  await pgPool.query(sql.DELETE_ROWS, [groupid]);
}

async function getAllGroups() {
  const result = await pgPool.query(sql.GET_ALL_GROUPS);
  return result.rows;
}

// postgre/group.js

async function joinGroup(username, groupid_usergroups) {
  try {
    // Check if the user is already a member of the group
    const isAlreadyMember = await checkMembership(username, groupid_usergroups);
    if (isAlreadyMember) {
      throw new Error("User is already a member of this group");
    }

    // If not a member, insert the user into the groupusers table
    await pgPool.query(sql.JOIN_GROUP, [username, groupid_usergroups]);

    return { message: "Successfully joined the group" };
  } catch (error) {
    console.error("Error joining group:", error);
    throw error;
  }
}

// Function to check if the user is already a member of the group
async function checkMembership(username, groupid_usergroups) {
  const result = await pgPool.query(
    "SELECT * FROM groupusers WHERE username = $1 AND groupid_usergroups = $2",
    [username, groupid_usergroups]
  );

  return result.rows.length > 0;
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
  getDeletedGroup,
  getAllGroups,
  joinGroup,
  getGroup,
  getCreatedGroup,
};
