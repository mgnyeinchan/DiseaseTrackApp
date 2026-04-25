const pool = require('../models/db');

// CREATE
exports.createCase = async (req, res) => {
  const { name, age } = req.body;

  const result = await pool.query(
    'INSERT INTO tbl_cases (name, age) VALUES ($1, $2) RETURNING *',
    [name, age]
  );

  res.json(result.rows[0]);
};

// READ
exports.getCases = async (req, res) => {
  const result = await pool.query('SELECT * FROM tbl_cases ORDER BY id DESC');
  res.json(result.rows);
};

// UPDATE
exports.updateCase = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  await pool.query(
    'UPDATE tbl_cases SET name=$1, age=$2 WHERE id=$3',
    [name, age, id]
  );

  res.json({ success: true });
};

// DELETE
exports.deleteCase = async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM tbl_cases WHERE id=$1', [id]);

  res.json({ success: true });
};