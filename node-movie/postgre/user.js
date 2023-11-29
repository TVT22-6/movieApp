const pgPool = require("./connection");

const sql = {
  INSERT_USER: "INSERT INTO customer (username, pw) VALUES ($1, $2)",
  GET_USERS: "SELECT username FROM customer",
  GET_PW: "SELECT pw FROM customer WHERE username=$1",
  DELETE_USER: "DELETE FROM customer WHERE username=$1",
  UPDATE_PW: "UPDATE customer SET pw=$2 WHERE username=$1",
};

async function addUser(uname, pw) {
  await pgPool.query(sql.INSERT_USER, [uname, pw]);
}

async function delUser(uname) {
  // Start a transaction
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');

    // Delete personal links
    const delPersonalLinksQuery = 'DELETE FROM personalpage WHERE username = $1';
    await client.query(delPersonalLinksQuery, [uname]);

    // Remove user from groups
    const delUserGroupsQuery = 'DELETE FROM groupusers WHERE username = $1';
    await client.query(delUserGroupsQuery, [uname]);

    // Delete user
    await client.query(sql.DELETE_USER, [uname]);

    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    throw error; // Re-throw the error to be handled by the caller
  } finally {
    client.release();
  }
}

async function getUsers() {
  const result = await pgPool.query(sql.GET_USERS);
  const rows = result.rows;
  return rows;
}

async function checkUser(username) {
  const result = await pgPool.query(sql.GET_PW, [username]);

  if (result.rows.length > 0) {
    return result.rows[0].pw;
  } else {
    return null;
  }
}

async function updateUserPassword(uname, newPw) {
  try {
    await pgPool.query(sql.UPDATE_PW, [uname, newPw]);
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

module.exports = { addUser, getUsers, checkUser, delUser, updateUserPassword };
