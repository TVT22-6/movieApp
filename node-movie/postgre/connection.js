require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false, // Note: Setting this to false is insecure for production environments
    // ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
  } : false,
});

pool.connect((err) => {
  if(err){
    console.error('Connection Error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = pool;