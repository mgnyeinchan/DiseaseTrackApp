const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null,
    status = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(project_name) LIKE LOWER($${i}) 
      OR LOWER(project_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (status !== null) {
    where += ` AND project_status = $${i}`;
    values.push(status);
    i++;
  }

  // ✅ data query
  const dataQuery = `
    SELECT project_id, project_code, project_name, project_funder, project_status
    FROM tbl_project
    ${where}
    ORDER BY project_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  // ✅ count query
  const countQuery = `
    SELECT COUNT(*) FROM tbl_project ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.getById = async (id) => {
  return db.query('SELECT * FROM tbl_project WHERE project_id = $1', [id]);
};

exports.create = async (data) => {
  const {
    project_code,
    project_name,
    project_funder,
    project_startdate,
    project_enddate,
    project_description,
    project_status
  } = data;

  return db.query(
    `INSERT INTO tbl_project 
    (project_code, project_name, project_funder, project_startdate, project_enddate, project_description, project_status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      project_code,
      project_name,
      project_funder,
      project_startdate,
      project_enddate,
      project_description,
      project_status || 1
    ]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_project SET
      project_code=$1,
      project_name=$2,
      project_funder=$3,
      project_startdate=$4,
      project_enddate=$5,
      project_description=$6,
      project_status=$7,
      updated_at=NOW()
     WHERE project_id=$8
     RETURNING *`,
    [
      data.project_code,
      data.project_name,
      data.project_funder,
      data.project_startdate,
      data.project_enddate,
      data.project_description,
      data.project_status,
      id
    ]
  );
};

exports.remove = async (id) => {
  return db.query('DELETE FROM tbl_project WHERE project_id=$1', [id]);
};