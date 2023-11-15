const pgPool = require("./connection");

const sql = {
  INSERT_USER: "INSERT INTO customer (username, pw) VALUES ($1, $2)",
  GET_USERS: "SELECT username FROM customer",
  GET_PW: "SELECT pw FROM customer WHERE username=$1",
  DELETE_USER: "DELETE FROM customer WHERE username=$1",
};

async function addUser(uname, pw) {
  await pgPool.query(sql.INSERT_USER, [uname, pw]);
}

async function delUser(uname, pw) {
  await pgPool.query(sql.DELETE_USER, [uname, pw]);
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

module.exports = { addUser, getUsers, checkUser, delUser };
