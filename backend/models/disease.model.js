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
      LOWER(d.disease_name) LIKE LOWER($${i})
      OR LOWER(d.disease_name_eng) LIKE LOWER($${i})
      OR LOWER(d.disease_name_mm) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  const dataQuery = `
    SELECT 
      d.disease_id,
      d.disease_name,
      d.disease_name_eng,
      d.disease_name_mm,
      d.disease_definition,
      d.created_at
    FROM tbl_disease d
    ${where}
    ORDER BY d.disease_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM tbl_disease d
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
    `SELECT * FROM tbl_disease WHERE disease_id=$1`,
    [id]
  );
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_disease 
      (disease_name, disease_name_eng, disease_name_mm, disease_definition)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [
      data.disease_name,
      data.disease_name_eng,
      data.disease_name_mm,
      data.disease_definition
    ]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_disease SET
      disease_name=$1,
      disease_name_eng=$2,
      disease_name_mm=$3,
      disease_definition=$4,
      updated_at=NOW()
     WHERE disease_id=$5
     RETURNING *`,
    [
      data.disease_name,
      data.disease_name_eng,
      data.disease_name_mm,
      data.disease_definition,
      id
    ]
  );
};

exports.remove = async (id) => {
  return db.query(
    `DELETE FROM tbl_disease WHERE disease_id=$1`,
    [id]
  );
};
exports.casebasedropdown = async () => {
  return db.query(`
    SELECT 
      disease_id,
      disease_name,
      disease_definition
    FROM tbl_disease
    WHERE disease_id < 9
    ORDER BY disease_id ASC
  `);
};
exports.weeklydropdown = async () => {
  return db.query(`
    SELECT 
      disease_id,
      disease_name,
      disease_definition
    FROM tbl_disease
    ORDER BY disease_id ASC
  `);
};