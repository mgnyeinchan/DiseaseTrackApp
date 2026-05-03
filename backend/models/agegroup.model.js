const db = require('./db');

/* =========================================================
   🔷 AGE GROUP MODEL
========================================================= */

// 🔍 get all (pagination + search)
exports.getAll = async (params = {}) => {
  const { page = 1, limit = 10, search = null } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND LOWER(agegroup_name) LIKE LOWER($${i})`;
    values.push(`%${search}%`);
    i++;
  }

  const dataQuery = `
    SELECT *
    FROM tbl_agegroup
    ${where}
    ORDER BY agegroup_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_agegroup ${where}
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
    `SELECT * FROM tbl_agegroup WHERE agegroup_id=$1`,
    [id]
  );
};

// ➕ create
exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_agegroup (agegroup_name)
     VALUES ($1)
     RETURNING *`,
    [data.agegroup_name]
  );
};

// ✏️ update
exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_agegroup SET
      agegroup_name=$1,
      updated_at=NOW()
     WHERE agegroup_id=$2
     RETURNING *`,
    [data.agegroup_name, id]
  );
};

// ❌ delete
exports.remove = async (id) => {
  return db.query(
    `DELETE FROM tbl_agegroup WHERE agegroup_id=$1`,
    [id]
  );
};

// 🔽 dropdown
exports.getDropdown = async () => {
  return db.query(
    `SELECT agegroup_id, agegroup_name
     FROM tbl_agegroup
     ORDER BY agegroup_name ASC`
  );
};