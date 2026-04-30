const db = require('./db');

exports.getAll = async ({
  page = 1,
  limit = 10,
  search,
  div_id,
  tsp_id,
  org_id
}) => {

  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(f.facility_name) LIKE LOWER($${i})
      OR LOWER(f.facility_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (div_id) {
    where += ` AND f.facility_div_id = $${i}`;
    values.push(div_id);
    i++;
  }

  if (tsp_id) {
    where += ` AND f.facility_tsp_id = $${i}`;
    values.push(tsp_id);
    i++;
  }

  if (org_id) {
    where += ` AND f.facility_org_id = $${i}`;
    values.push(org_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      f.*,
      d.div_name,
      t.tsp_name,
      o.org_name
    FROM tbl_facility f
    LEFT JOIN tbl_division d ON f.facility_div_id = d.div_id
    LEFT JOIN tbl_township t ON f.facility_tsp_id = t.tsp_id
    LEFT JOIN tbl_org o ON f.facility_org_id = o.org_id
    ${where}
    ORDER BY f.facility_id DESC
    LIMIT $${i} OFFSET $${i+1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_facility f ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.create = (data) => {
  return db.query(
    `INSERT INTO tbl_facility 
    (facility_code, facility_name, facility_div_id, facility_tsp_id, facility_org_id, facility_type)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [
      data.facility_code,
      data.facility_name,
      data.facility_div_id,
      data.facility_tsp_id,
      data.facility_org_id,
      data.facility_type
    ]
  );
};

exports.update = (id, data) => {
  return db.query(
    `UPDATE tbl_facility SET
      facility_code=$1,
      facility_name=$2,
      facility_div_id=$3,
      facility_tsp_id=$4,
      facility_org_id=$5,
      facility_type=$6,
      updated_at=NOW()
     WHERE facility_id=$7
     RETURNING *`,
    [
      data.facility_code,
      data.facility_name,
      data.facility_div_id,
      data.facility_tsp_id,
      data.facility_org_id,
      data.facility_type,
      id
    ]
  );
};

exports.getById = (id) =>
  db.query(`SELECT * FROM tbl_facility WHERE facility_id=$1`, [id]);

exports.remove = (id) =>
  db.query(`DELETE FROM tbl_facility WHERE facility_id=$1`, [id]);

exports.dropdown = async () => {
  return db.query(`
    SELECT 
      f.facility_id,
      f.facility_name,
      f.facility_type,

      t.tsp_id,
      t.tsp_name,

      d.div_id,
      d.div_name,

      o.org_id,
      o.org_name

    FROM tbl_facility f
    LEFT JOIN tbl_township t ON f.facility_tsp_id = t.tsp_id
    LEFT JOIN tbl_division d ON f.facility_div_id = d.div_id
    LEFT JOIN tbl_org o ON f.facility_org_id = o.org_id

    ORDER BY f.facility_name ASC
  `);
};