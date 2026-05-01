const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  return await pool.query(
    `SELECT * FROM tbl_whoopingcough WHERE casebase_id=$1`,
    [casebase_id]
  );
};

exports.createWhoopingCough = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_whoopingcough (
      casebase_id, disease_id,
      dpt_vaccine, fever_start_date,
      fever_days, cough,
      breathing_difficulty, paroxysm_date,
      patient_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    Object.values(data)
  );
  return result.rows[0];
};

exports.updateWhoopingCough = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_whoopingcough SET
      dpt_vaccine=$1, fever_start_date=$2,
      fever_days=$3, cough=$4,
      breathing_difficulty=$5, paroxysm_date=$6,
      patient_status=$7,
      updated_at=NOW()
     WHERE casebase_id=$8 AND disease_id=$9
     RETURNING *`,
    [
      data.dpt_vaccine,
      data.fever_start_date,
      data.fever_days,
      data.cough,
      data.breathing_difficulty,
      data.paroxysm_date,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

exports.deleteWhoopingCough = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_whoopingcough WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};