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

  if (search) {
    where += ` AND (
      LOWER(v.village_name) LIKE LOWER($${i})
      OR LOWER(v.village_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (township_id) {
    where += ` AND v.village_tsp_id = $${i}`;
    values.push(township_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      v.village_id,
      v.village_code,
      v.village_name,
      v.village_namemm,
      v.village_malepop,
      v.village_femalepop,
      v.village_latitude,
      v.village_longitude,
      v.village_household,
      v.village_status,
      v.village_remark,
      v.village_tsp_id,
      t.tsp_name
    FROM tbl_village v
    LEFT JOIN tbl_township t ON v.village_tsp_id = t.tsp_id
    ${where}
    ORDER BY v.village_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM tbl_village v
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
  return db.query(
    `SELECT * FROM tbl_village WHERE village_id = $1`,
    [id]
  );
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_village (
      village_code,
      village_name,
      village_namemm,
      village_malepop,
      village_femalepop,
      village_latitude,
      village_longitude,
      village_household,
      village_tsp_id,
      village_status,
      village_remark
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      data.village_code,
      data.village_name,
      data.village_namemm,
      data.village_malepop,
      data.village_femalepop,
      data.village_latitude,
      data.village_longitude,
      data.village_household,
      data.village_tsp_id,
      data.village_status || 1,
      data.village_remark
    ]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_village SET
      village_code=$1,
      village_name=$2,
      village_namemm=$3,
      village_malepop=$4,
      village_femalepop=$5,
      village_latitude=$6,
      village_longitude=$7,
      village_household=$8,
      village_tsp_id=$9,
      village_status=$10,
      village_remark=$11,
      updated_at=NOW()
     WHERE village_id=$12
     RETURNING *`,
    [
      data.village_code,
      data.village_name,
      data.village_namemm,
      data.village_malepop,
      data.village_femalepop,
      data.village_latitude,
      data.village_longitude,
      data.village_household,
      data.village_tsp_id,
      data.village_status,
      data.village_remark,
      id
    ]
  );
};

exports.remove = async (id) => {
  return db.query(
    `DELETE FROM tbl_village WHERE village_id=$1`,
    [id]
  );
};

exports.dropdown = () => {
  return db.query(`
    SELECT 
      v.village_id,
      v.village_name,
      v.village_tsp_id AS tsp_id,
      t.tsp_name
    FROM tbl_village v
    LEFT JOIN tbl_township t 
      ON v.village_tsp_id = t.tsp_id
    ORDER BY v.village_name
  `);
};