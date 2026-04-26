const db = require('./db');

exports.getAll = async ({ page, limit, search, status }) => {
  const offset = (page - 1) * limit;

  return db.query(
    `
    SELECT *
    FROM tbl_project
    WHERE
      ($1::text IS NULL OR project_name ILIKE '%' || $1 || '%')
      AND ($2::int IS NULL OR project_status = $2)
    ORDER BY project_id DESC
    LIMIT $3 OFFSET $4
    `,
    [search || null, status || null, limit, offset]
  );
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