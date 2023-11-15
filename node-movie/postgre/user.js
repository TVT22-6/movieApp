const pgPool = require("./connection");

const sql = {
<<<<<<< HEAD
  INSERT_USER: "INSERT INTO customer (username, pw) VALUES ($1, $2)",
  GET_USERS: "SELECT username FROM customer",
  GET_PW: "SELECT pw FROM customer WHERE username=$1",
=======
    INSERT_USER: 'INSERT INTO customer (username, pw) VALUES ($1, $2)',
    GET_USERS: 'SELECT username FROM customer',
    GET_PW: 'SELECT pw FROM customer WHERE username=$1',
    DELETE_USER: 'DELETE FROM customer WHERE username=$1'
>>>>>>> 4cf28b86e7b05b193b689a32f9cdf3762f89ecc9
};

async function addUser(uname, pw) {
  await pgPool.query(sql.INSERT_USER, [uname, pw]);
}

<<<<<<< HEAD
async function getUsers() {
  const result = await pgPool.query(sql.GET_USERS);
  const rows = result.rows;
  return rows;
=======
async function delUser(uname,pw){
    await pgPool.query(sql.DELETE_USER, [uname,pw]);
}

async function getUsers(){
    const result = await pgPool.query(sql.GET_USERS);
    const rows = result.rows;
    return rows;
>>>>>>> 4cf28b86e7b05b193b689a32f9cdf3762f89ecc9
}

async function checkUser(username) {
  const result = await pgPool.query(sql.GET_PW, [username]);

  if (result.rows.length > 0) {
    return result.rows[0].pw;
  } else {
    return null;
  }
}

<<<<<<< HEAD
module.exports = { addUser, getUsers, checkUser };
=======
module.exports = {addUser, getUsers, checkUser, delUser};
>>>>>>> 4cf28b86e7b05b193b689a32f9cdf3762f89ecc9
