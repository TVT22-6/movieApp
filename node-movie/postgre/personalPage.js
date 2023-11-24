const pgPool = require("./connection");

const sql = {
    INSERT_PERSONAL_PAGE_ITEM: `
      INSERT INTO personalpage (username, linkName, personalLink, shareable)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
  GET_PERSONAL_LINKS_BY_USER: `
    SELECT * FROM "personalpage"
    WHERE userid = $1
  `,
  // Add more SQL commands as needed for other operations
};

async function addPersonalLink(username, linkName, personalLink, shareable) {
    const result = await pgPool.query(sql.INSERT_PERSONAL_PAGE_ITEM, [
      username,
      linkName,
      personalLink,
      shareable
    ]);
    return result.rows[0];
  }

async function getPersonalLinksByUser(userid) {
  const result = await pgPool.query(sql.GET_PERSONAL_LINKS_BY_USER, [userid]);
  return result.rows; // Returns an array of personal links
}

module.exports = { addPersonalLink, getPersonalLinksByUser };
  