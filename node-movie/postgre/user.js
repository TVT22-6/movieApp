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
  await pgPool.query(sql.DELETE_USER, [uname]);
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
