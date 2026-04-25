const { Pool } = require('pg');

const pool = new Pool({
  user: 'surveillance_owner',
  host: 'localhost',
  database: 'surveillancedb',
  password: '2026AdmInUser1',
  port: 5432,
});

module.exports = pool;