const pool = require('./db');

// ================= GET =================
exports.getByCasebaseId = async (casebase_id) => {
  console.log('NNT getByCasebaseId 👉', casebase_id);

  return await pool.query(
    `SELECT * FROM tbl_nnt WHERE casebase_id=$1`,
    [casebase_id]
  );
};

// ================= CREATE =================
exports.createNNT = async (data) => {
  const values = [
    data.casebase_id,
    data.disease_id,
    data.tt_vaccinated,
    data.symptom_onset_date,
    data.normal_breastfeeding,
    data.difficulty_feeding,
    data.stiffness,
    data.convulsion,
    data.patient_status
  ];

  console.log("🔥 CREATE NNT 👉", values);

  const result = await pool.query(
    `INSERT INTO tbl_nnt (
      casebase_id, disease_id,
      tt_vaccinated, symptom_onset_date,
      normal_breastfeeding, difficulty_feeding,
      stiffness, convulsion, patient_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    values
  );

  return result.rows[0];
};

// ================= UPDATE =================
exports.updateNNT = async (casebase_id, disease_id, data) => {
  const values = [
    data.tt_vaccinated,
    data.symptom_onset_date,
    data.normal_breastfeeding,
    data.difficulty_feeding,
    data.stiffness,
    data.convulsion,
    data.patient_status,
    casebase_id,
    disease_id
  ];

  console.log("🔥 UPDATE NNT 👉", values);

  const result = await pool.query(
    `UPDATE tbl_nnt SET
      tt_vaccinated=$1,
      symptom_onset_date=$2,
      normal_breastfeeding=$3,
      difficulty_feeding=$4,
      stiffness=$5,
      convulsion=$6,
      patient_status=$7,
      updated_at=NOW()
     WHERE casebase_id=$8 AND disease_id=$9
     RETURNING *`,
    values
  );

  return result.rows[0];
};

// ================= DELETE =================
exports.deleteNNT = async (casebase_id, disease_id) => {
  console.log("🔥 DELETE NNT 👉", casebase_id, disease_id);

  await pool.query(
    `DELETE FROM tbl_nnt WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};