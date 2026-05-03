const db = require('./db');

/* =========================================================
   🔷 AWARENESS SOURCE MODEL
========================================================= */

// 🔍 get all (pagination + search)
exports.getAll = async (params = {}) => {
  const { page = 1, limit = 10, search = null } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND LOWER(source_name) LIKE LOWER($${i})`;
    values.push(`%${search}%`);
    i++;
  }

  const dataQuery = `
    SELECT *
    FROM tbl_awarenesssource
    ${where}
    ORDER BY id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_awarenesssource ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

// 🔎 get by id
exports.getById = async (id) => {
  return db.query(
    `SELECT * FROM tbl_awarenesssource WHERE id=$1`,
    [id]
  );
};

// ➕ create
exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_awarenesssource (source_name, source_remark)
     VALUES ($1,$2)
     RETURNING *`,
    [data.source_name, data.source_remark]
  );
};

// ✏️ update
exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_awarenesssource SET
      source_name=$1,
      source_remark=$2,
      updated_at=NOW()
     WHERE id=$3
     RETURNING *`,
    [data.source_name, data.source_remark, id]
  );
};

// ❌ delete
exports.remove = async (id) => {
  return db.query(
    `DELETE FROM tbl_awarenesssource WHERE id=$1`,
    [id]
  );
};

// 🔽 dropdown (mobile use)
exports.getDropdown = async () => {
  return db.query(
    `SELECT id, source_name
     FROM tbl_awarenesssource
     ORDER BY source_name ASC`
  );
};