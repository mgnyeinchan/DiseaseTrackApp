const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(div_name) LIKE LOWER($${i})
      OR LOWER(div_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  const dataQuery = `
    SELECT div_id, div_code, div_name, div_namemm
    FROM tbl_division
    ${where}
    ORDER BY div_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_division ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};
exports.getAllDivision = async () => {
  return db.query('SELECT div_id, div_name FROM tbl_division ORDER BY div_name');
};

exports.getById = async (id) => {
  return db.query('SELECT * FROM tbl_division WHERE div_id = $1', [id]);
};

exports.create = async (data) => {
  const { div_code, div_name, div_namemm } = data;

  return db.query(
    `INSERT INTO tbl_division (div_code, div_name, div_namemm)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [div_code, div_name, div_namemm]
  );
};

exports.update = async (id, data) => {
  const { div_code, div_name, div_namemm } = data;

  return db.query(
    `UPDATE tbl_division SET
      div_code=$1,
      div_name=$2,
      div_namemm=$3,
      updated_at=NOW()
     WHERE div_id=$4
     RETURNING *`,
    [div_code, div_name, div_namemm, id]
  );
};

exports.remove = async (id) => {
  return db.query('DELETE FROM tbl_division WHERE div_id=$1', [id]);
};

exports.dropdown = async () => {
  return db.query(`
    SELECT div_id, div_name
    FROM tbl_division
    ORDER BY div_name ASC
  `);
};