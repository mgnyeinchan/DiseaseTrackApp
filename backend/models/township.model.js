const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null,
    division_id = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(t.tsp_name) LIKE LOWER($${i})
      OR LOWER(t.tsp_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (division_id) {
    where += ` AND t.tps_div_id = $${i}`;
    values.push(division_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      t.tsp_id,
      t.tsp_code,
      t.tsp_name,
      t.tps_div_id,
      d.div_name
    FROM tbl_township t
    LEFT JOIN tbl_division d ON t.tps_div_id = d.div_id
    ${where}
    ORDER BY t.tsp_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM tbl_township t
    ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_township (tsp_code, tsp_name, tps_div_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [data.tsp_code, data.tsp_name, data.tps_div_id]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_township SET
      tsp_code=$1,
      tsp_name=$2,
      tps_div_id=$3,
      updated_at=NOW()
     WHERE tsp_id=$4
     RETURNING *`,
    [data.tsp_code, data.tsp_name, data.tps_div_id, id]
  );
};

exports.remove = async (id) => {
  return db.query('DELETE FROM tbl_township WHERE tsp_id=$1', [id]);
};

exports.getDropdown = async () => {
  return db.query(`
    SELECT tsp_id, tsp_name
    FROM tbl_township
    ORDER BY tsp_name ASC
  `);
};