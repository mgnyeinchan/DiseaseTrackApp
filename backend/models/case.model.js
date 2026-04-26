const pool = require('./db');

// CREATE
exports.create = async ({ name, age }) => {
  const result = await pool.query(
    'INSERT INTO tbl_cases (name, age) VALUES ($1, $2) RETURNING *',
    [name, age]
  );
  return result.rows[0];
};

// READ
exports.findAll = async () => {
  const result = await pool.query(
    'SELECT * FROM tbl_cases ORDER BY id DESC'
  );
  return result.rows;
};

// UPDATE
exports.update = async (id, { name, age }) => {
  await pool.query(
    'UPDATE tbl_cases SET name=$1, age=$2 WHERE id=$3',
    [name, age, id]
  );
};

// DELETE
exports.remove = async (id) => {
  await pool.query(
    'DELETE FROM tbl_cases WHERE id=$1',
    [id]
  );
};