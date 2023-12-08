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
    "SELECT groups.gname, groupusers.username FROM groups INNER JOIN groupusers ON groups.groupid = groupusers.groupid_usergroups WHERE groups.groupid = $1",
  LEAVE_GROUP:
    "DELETE FROM groupusers WHERE username = $1 AND groupid_usergroups = $2",
  GROUP_REVIEWS:
    'SELECT r.genre, r.dateposted, r.reviewid, r.content, r.uservotescore, r.moviename, r.username FROM "Review" r JOIN groupusers gu ON r.username = gu.username WHERE gu.groupid_usergroups = $1;',
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

async function getCreatedGroup(gname) {
  try {
    const result = await pgPool.query(sql.GET_GROUP, [gname]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

async function getSpecificGroupDetails(groupid) {
  const result = await pgPool.query(sql.SPECIFIC_GROUP, [groupid]);

  // Check if there are any rows in the result
  if (result.rows.length === 0) {
    // Handle the case where no rows are found, e.g., return null or throw an error
    return null;
  }

  const groupDetails = {
    gname: result.rows[0].gname,
    groupid: result.rows[0].groupid,
    users: result.rows.map((row) => ({ username: row.username })),
  };
  return groupDetails;
}

async function leaveGroup(username, groupid_usergroups) {
  try {
    // Check if the user is a member of the group
    const isMember = await checkMembership(username, groupid_usergroups);
    if (!isMember) {
      throw new Error("User is not a member of this group");
    }

    // If a member, delete the user from the groupusers table
    await pgPool.query(sql.LEAVE_GROUP, [username, groupid_usergroups]);

    return { success: true, message: "Successfully left the group" };
  } catch (error) {
    console.error("Error leaving group:", error);
    throw error;
  }
}

async function getGroupReviews(groupid) {
  try {
    const result = await pgPool.query(sql.GROUP_REVIEWS, [groupid]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching group reviews:", error);
    throw error;
  }
}

module.exports = {
  addGroup,
  deleteGroup,
  getDeletedGroup,
  getAllGroups,
  joinGroup,
  getCreatedGroup,
  getSpecificGroupDetails,
  leaveGroup,
  getGroupReviews,
  checkMembership,
};
