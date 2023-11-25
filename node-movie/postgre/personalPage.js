const pgPool = require("./connection");

const sql = {
    INSERT_PERSONAL_PAGE_ITEM: `
      INSERT INTO personalpage (username, linkName, personalLink)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    GET_PERSONAL_LINKS_BY_USER: 'SELECT linkname, personallink, dateadded FROM personalPage WHERE username = $1',
    
  // Add more SQL commands as needed for other operations
};

async function addPersonalLink(username, linkName, personalLink) {
    const result = await pgPool.query(sql.INSERT_PERSONAL_PAGE_ITEM, [
      username,
      linkName,
      personalLink
    ]);
    return result.rows[0];
  }

  async function getPersonalLinksByUser(username) {
    const result = await pgPool.query(sql.GET_PERSONAL_LINKS_BY_USER, [username]);
    return result.rows;
  }

module.exports = { addPersonalLink, getPersonalLinksByUser };
  