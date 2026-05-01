const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  return await pool.query(
    `SELECT * FROM tbl_aes WHERE casebase_id=$1`,
    [casebase_id]
  );
};

exports.createAES = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_aes (
      casebase_id, disease_id,
      je_vaccine, onset_date, rapid_onset,
      fever, paresis, headache,
      paralysis, neck_stiffness,
      seizure, mental_change, patient_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    Object.values(data)
  );
  return result.rows[0];
};

exports.updateAES = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_aes SET
      je_vaccine=$1, onset_date=$2, rapid_onset=$3,
      fever=$4, paresis=$5, headache=$6,
      paralysis=$7, neck_stiffness=$8,
      seizure=$9, mental_change=$10, patient_status=$11,
      updated_at=NOW()
     WHERE casebase_id=$12 AND disease_id=$13
     RETURNING *`,
    [
      data.je_vaccine,
      data.onset_date,
      data.rapid_onset,
      data.fever,
      data.paresis,
      data.headache,
      data.paralysis,
      data.neck_stiffness,
      data.seizure,
      data.mental_change,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

exports.deleteAES = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_aes WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};