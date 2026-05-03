const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null,
    facility_id = null,
    event_tsp_id = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(s.report_reason) LIKE LOWER($${i})
      OR LOWER(s.event_location_detail) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (facility_id) {
    where += ` AND s.facility_id = $${i}`;
    values.push(facility_id);
    i++;
  }

  if (event_tsp_id) {
    where += ` AND s.event_tsp_id = $${i}`;
    values.push(event_tsp_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      s.*,
      f.facility_name,
      t.tsp_name
    FROM tbl_surveillance s
    LEFT JOIN tbl_facility f ON s.facility_id = f.facility_id
    LEFT JOIN tbl_township t ON s.event_tsp_id = t.tsp_id
    ${where}
    ORDER BY s.id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM tbl_surveillance s
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
    `SELECT * FROM tbl_surveillance WHERE id=$1`,
    [id]
  );
};

exports.create = async (data) => {
  return db.query(
    `INSERT INTO tbl_surveillance (
      facility_id,
      reporter_name,
      report_date,
      report_reason,
      report_by_audio,
      awarenesssource_id,
      event_datetime,
      event_tsp_id,
      event_location_detail,
      agegroup_id,
      total_cases,
      total_deaths,
      hospitalized_count,
      at_risk_count,
      triage_result,
      verification_result,
      event_assessment,
      reported_to_higher_date,
      response_actions,
      recorded_by
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
    )
    RETURNING *`,
    [
      data.facility_id,
      data.reporter_name,
      data.report_date,
      data.report_reason,
      data.report_by_audio,
      data.awarenesssource_id,
      data.event_datetime,
      data.event_tsp_id,
      data.event_location_detail,
      data.agegroup_id,
      data.total_cases || 0,
      data.total_deaths || 0,
      data.hospitalized_count || 0,
      data.at_risk_count || 0,
      data.triage_result,
      data.verification_result,
      data.event_assessment,
      data.reported_to_higher_date,
      data.response_actions,
      data.recorded_by
    ]
  );
};

exports.update = async (id, data) => {
  return db.query(
    `UPDATE tbl_surveillance SET
      facility_id=$1,
      reporter_name=$2,
      report_date=$3,
      report_reason=$4,
      report_by_audio=$5,
      awarenesssource_id=$6,
      event_datetime=$7,
      event_tsp_id=$8,
      event_location_detail=$9,
      agegroup_id=$10,
      total_cases=$11,
      total_deaths=$12,
      hospitalized_count=$13,
      at_risk_count=$14,
      triage_result=$15,
      verification_result=$16,
      event_assessment=$17,
      reported_to_higher_date=$18,
      response_actions=$19,
      recorded_by=$20,
      updated_at=NOW()
    WHERE id=$21
    RETURNING *`,
    [
      data.facility_id,
      data.reporter_name,
      data.report_date,
      data.report_reason,
      data.report_by_audio,
      data.awarenesssource_id,
      data.event_datetime,
      data.event_tsp_id,
      data.event_location_detail,
      data.agegroup_id,
      data.total_cases,
      data.total_deaths,
      data.hospitalized_count,
      data.at_risk_count,
      data.triage_result,
      data.verification_result,
      data.event_assessment,
      data.reported_to_higher_date,
      data.response_actions,
      data.recorded_by,
      id
    ]
  );
};

exports.remove = async (id) => {
  return db.query(
    'DELETE FROM tbl_surveillance WHERE id=$1',
    [id]
  );
};