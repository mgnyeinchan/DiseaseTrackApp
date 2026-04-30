const db = require('./db');

exports.getAll = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = null,
    tsp_id = null,
    div_id = null,
    facility_id = null
  } = params;

  const offset = (page - 1) * limit;

  let where = `WHERE 1=1`;
  let values = [];
  let i = 1;

  if (search) {
    where += ` AND (
      LOWER(patient_name) LIKE LOWER($${i})
      OR LOWER(patient_code) LIKE LOWER($${i})
    )`;
    values.push(`%${search}%`);
    i++;
  }

  if (tsp_id) {
    where += ` AND tsp_id = $${i}`;
    values.push(tsp_id);
    i++;
  }

  if (div_id) {
    where += ` AND div_id = $${i}`;
    values.push(div_id);
    i++;
  }

  if (facility_id) {
    where += ` AND facility_id = $${i}`;
    values.push(facility_id);
    i++;
  }

  const dataQuery = `
    SELECT 
      c.*,
      f.facility_name,
      t.tsp_name,
      d.div_name,
      dis.disease_name
    FROM tbl_casebase c
    LEFT JOIN tbl_facility f ON c.facility_id = f.facility_id
    LEFT JOIN tbl_township t ON c.tsp_id = t.tsp_id
    LEFT JOIN tbl_division d ON c.div_id = d.div_id
    LEFT JOIN tbl_disease dis ON c.disease_id = dis.disease_id
    ${where}
    ORDER BY c.casebase_id DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM tbl_casebase
    ${where}
  `;

  const data = await db.query(dataQuery, [...values, limit, offset]);
  const count = await db.query(countQuery, values);

  return {
    rows: data.rows,
    total: parseInt(count.rows[0].count)
  };
};

exports.getById = (id) => {
  return db.query(
    `SELECT * FROM tbl_casebase WHERE casebase_id = $1`,
    [id]
  );
};

exports.create = (data) => {
  return db.query(
    `INSERT INTO tbl_casebase (
      reporter_name, reporter_position, facility_id,
      visit_date, patient_code, patient_name, gender,
      age_year, age_month,
      father_name, mother_name,
      tsp_id, div_id, village_id,
      phone, disease_id,
      attachment_url, remark
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12,$13,$14,
      $15,$16,$17,$18
    ) RETURNING *`,
    [
      data.reporter_name,
      data.reporter_position,
      data.facility_id,
      data.visit_date,
      data.patient_code,
      data.patient_name,
      data.gender,
      data.age_year,
      data.age_month,
      data.father_name,
      data.mother_name,
      data.tsp_id,
      data.div_id,
      data.village_id,
      data.phone,
      data.disease_id,
      data.attachment_url,
      data.remark
    ]
  );
};

exports.update = (id, data) => {
  return db.query(
    `UPDATE tbl_casebase SET
      reporter_name=$1,
      reporter_position=$2,
      facility_id=$3,
      visit_date=$4,
      patient_code=$5,
      patient_name=$6,
      gender=$7,
      age_year=$8,
      age_month=$9,
      father_name=$10,
      mother_name=$11,
      tsp_id=$12,
      div_id=$13,
      village_id=$14,
      phone=$15,
      disease_id=$16,
      attachment_url=$17,
      remark=$18,
      updated_at=NOW()
    WHERE casebase_id=$19
    RETURNING *`,
    [
      data.reporter_name,
      data.reporter_position,
      data.facility_id,
      data.visit_date,
      data.patient_code,
      data.patient_name,
      data.gender,
      data.age_year,
      data.age_month,
      data.father_name,
      data.mother_name,
      data.tsp_id,
      data.div_id,
      data.village_id,
      data.phone,
      data.disease_id,
      data.attachment_url,
      data.remark,
      id
    ]
  );
};

exports.remove = (id) => {
  return db.query(
    `DELETE FROM tbl_casebase WHERE casebase_id=$1`,
    [id]
  );
};