const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  console.log('getByCasebaseId ',casebase_id)
  return await pool.query(
    `SELECT * FROM tbl_afp WHERE casebase_id=$1`,
    [casebase_id]
  );
};

// CREATE
exports.createAFP = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_afp (
      casebase_id, disease_id,
      opv_ipv_vaccinated, paralysis_duration, acute_paralysis,
      fever_within_3weeks, fever_onset_day, patient_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.casebase_id,
      data.disease_id,
      data.opv_ipv_vaccinated,
      data.paralysis_duration,
      data.acute_paralysis,
      data.fever_within_3weeks,
      data.fever_onset_day,
      data.patient_status
    ]
  );
  return result.rows[0];
};

// UPDATE
exports.updateAFP = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_afp SET
      opv_ipv_vaccinated=$1,
      paralysis_duration=$2,
      acute_paralysis=$3,
      fever_within_3weeks=$4,
      fever_onset_day=$5,
      patient_status=$6,
      updated_at=NOW()
     WHERE casebase_id=$7 AND disease_id=$8
     RETURNING *`,
    [
      data.opv_ipv_vaccinated,
      data.paralysis_duration,
      data.acute_paralysis,
      data.fever_within_3weeks,
      data.fever_onset_day,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

// DELETE
exports.deleteAFP = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_afp WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};