const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  console.log('getByCasebaseId ', casebase_id);
  return await pool.query(
    `SELECT * FROM tbl_suspectedcholera WHERE casebase_id=$1`,
    [casebase_id]
  );
};

// CREATE
exports.createCholera = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_suspectedcholera (
      casebase_id, disease_id,
      cholera_vaccine, onset_date,
      diarrhea, vomiting, nausea,
      abdominal_pain, fever,
      headache, myalgia,
      other_symptoms, patient_status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    ) RETURNING *`,
    [
      data.casebase_id,
      data.disease_id,
      data.cholera_vaccine,
      data.onset_date,
      data.diarrhea,
      data.vomiting,
      data.nausea,
      data.abdominal_pain,
      data.fever,
      data.headache,
      data.myalgia,
      data.other_symptoms,
      data.patient_status
    ]
  );
  return result.rows[0];
};

// UPDATE
exports.updateCholera = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_suspectedcholera SET
      cholera_vaccine=$1, onset_date=$2,
      diarrhea=$3, vomiting=$4, nausea=$5,
      abdominal_pain=$6, fever=$7,
      headache=$8, myalgia=$9,
      other_symptoms=$10, patient_status=$11,
      updated_at=NOW()
     WHERE casebase_id=$12 AND disease_id=$13
     RETURNING *`,
    [
      data.cholera_vaccine,
      data.onset_date,
      data.diarrhea,
      data.vomiting,
      data.nausea,
      data.abdominal_pain,
      data.fever,
      data.headache,
      data.myalgia,
      data.other_symptoms,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

// DELETE
exports.deleteCholera = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_suspectedcholera WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};