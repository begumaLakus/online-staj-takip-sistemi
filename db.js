const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'online_staj',
  password: 'hamza1357',
  port: 5432,
});

module.exports = pool;
