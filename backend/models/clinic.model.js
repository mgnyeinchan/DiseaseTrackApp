const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null,
    township_id = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  // 🔍 search
  if (search) {
    where += ` AND (
      LOWER(c.cln_name) LIKE LOWER($${i})
      OR LOWER(c.cln_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  // 🔽 filter by township
  if (township_id) {
    where += ` AND c.cln_tsp_id = $${i}`;
    values.push(township_id);
    i++;
  }

  const dataQuery = `
    SELECT
      c.cln_id,
      c.cln_code,
      c.cln_name,
      c.cln_tsp_id,
      t.tsp_name
    FROM tbl_clinic c
    LEFT JOIN tbl_township t ON c.cln_tsp_id = t.tsp_id
    ${where}
    ORDER BY c.cln_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*)
    FROM tbl_clinic c
    ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.getById = async (id) => {
  return db.query(`
    SELECT
      c.*,
      t.tsp_name
    FROM tbl_clinic c
    LEFT JOIN tbl_township t ON c.cln_tsp_id = t.tsp_id
    WHERE c.cln_id = $1
  `, [id]);
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_clinic (cln_code, cln_name, cln_tsp_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [data.cln_code, data.cln_name, data.cln_tsp_id]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_clinic SET
      cln_code=$1,
      cln_name=$2,
      cln_tsp_id=$3,
      updated_at=NOW()
     WHERE cln_id=$4
     RETURNING *`,
    [data.cln_code, data.cln_name, data.cln_tsp_id, id]
  );
};

exports.remove = async (id) => {
  return db.query('DELETE FROM tbl_clinic WHERE cln_id=$1', [id]);
};

// 🔥 dropdown
exports.getDropdown = async () => {
  return db.query(`
    SELECT cln_id, cln_name
    FROM tbl_clinic
    ORDER BY cln_name ASC
  `);
};