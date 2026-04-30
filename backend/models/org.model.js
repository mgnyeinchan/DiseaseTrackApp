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
      LOWER(org_name) LIKE LOWER($${i})
      OR LOWER(org_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  const dataQuery = `
    SELECT org_id, org_code, org_name, org_shortname
    FROM tbl_org
    ${where}
    ORDER BY org_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_org ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.getById = (id) => {
  return db.query('SELECT * FROM tbl_org WHERE org_id=$1', [id]);
};

exports.create = (data) => {
  return db.query(
    `INSERT INTO tbl_org (org_code, org_name, org_shortname)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [data.org_code, data.org_name, data.org_shortname]
  );
};

exports.update = (id, data) => {
  return db.query(
    `UPDATE tbl_org SET
      org_code=$1,
      org_name=$2,
      org_shortname=$3,
      updated_at=NOW()
     WHERE org_id=$4
     RETURNING *`,
    [data.org_code, data.org_name, data.org_shortname, id]
  );
};

exports.remove = (id) => {
  return db.query('DELETE FROM tbl_org WHERE org_id=$1', [id]);
};

exports.dropdown = async () => {
  return db.query(`
    SELECT org_id, org_name
    FROM tbl_org
    ORDER BY org_name ASC
  `);
};