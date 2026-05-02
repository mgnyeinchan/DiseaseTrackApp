const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    year = null,
    week = null,
    facility_id = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (year) {
    where += ` AND wr.report_year = $${i}`;
    values.push(year);
    i++;
  }

  if (week) {
    where += ` AND wr.report_week = $${i}`;
    values.push(week);
    i++;
  }

  if (facility_id) {
    where += ` AND wr.facility_id = $${i}`;
    values.push(facility_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      wr.*,
      f.facility_name
    FROM tbl_weeklyreport wr
    LEFT JOIN tbl_facility f ON wr.facility_id = f.facility_id
    ${where}
    ORDER BY wr.id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM tbl_weeklyreport wr
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
    `SELECT * FROM tbl_weeklyreport WHERE id=$1`,
    [id]
  );
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_weeklyreport (
      reporter_name,
      reporter_position,
      report_date,
      report_week,
      report_year,
      report_start_date,
      report_end_date,
      facility_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.reporter_name,
      data.reporter_position,
      data.report_date,
      data.report_week,
      data.report_year,
      data.report_start_date,
      data.report_end_date,
      data.facility_id
    ]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_weeklyreport SET
      reporter_name=$1,
      reporter_position=$2,
      report_date=$3,
      report_week=$4,
      report_year=$5,
      report_start_date=$6,
      report_end_date=$7,
      facility_id=$8,
      updated_at=NOW()
    WHERE id=$9
    RETURNING *`,
    [
      data.reporter_name,
      data.reporter_position,
      data.report_date,
      data.report_week,
      data.report_year,
      data.report_start_date,
      data.report_end_date,
      data.facility_id,
      id
    ]
  );
};

exports.remove = async (id) => {
  return db.query(
    `DELETE FROM tbl_weeklyreport WHERE id=$1`,
    [id]
  );
};