const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  console.log('FeverWithRash getByCasebaseId', casebase_id);

  return await pool.query(
    `SELECT * FROM tbl_feverwithrash WHERE casebase_id=$1`,
    [casebase_id]
  );
};

exports.createFeverWithRash = async (data) => {
  const values = [
    data.casebase_id,
    data.disease_id,
    data.mr_mmr_vaccinated,
    data.fever,
    data.rash,
    data.cough,
    data.runny_nose,
    data.red_eyes,
    data.joint_pain,
    data.lymph_nodes,
    data.other_symptoms,
    data.patient_status
  ];

  console.log("CREATE FeverWithRash", values);

  const result = await pool.query(
    `INSERT INTO tbl_feverwithrash (
      casebase_id, disease_id,
      mr_mmr_vaccinated, fever, rash, cough,
      runny_nose, red_eyes, joint_pain,
      lymph_nodes, other_symptoms, patient_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    values
  );

  return result.rows[0];
};

exports.updateFeverWithRash = async (casebase_id, disease_id, data) => {
  const values = [
    data.mr_mmr_vaccinated,
    data.fever,
    data.rash,
    data.cough,
    data.runny_nose,
    data.red_eyes,
    data.joint_pain,
    data.lymph_nodes,
    data.other_symptoms,
    data.patient_status,
    casebase_id,
    disease_id
  ];

  console.log("UPDATE FeverWithRash", values);

  const result = await pool.query(
    `UPDATE tbl_feverwithrash SET
      mr_mmr_vaccinated=$1,
      fever=$2,
      rash=$3,
      cough=$4,
      runny_nose=$5,
      red_eyes=$6,
      joint_pain=$7,
      lymph_nodes=$8,
      other_symptoms=$9,
      patient_status=$10,
      updated_at=NOW()
     WHERE casebase_id=$11 AND disease_id=$12
     RETURNING *`,
    values
  );

  return result.rows[0];
};

exports.deleteFeverWithRash = async (casebase_id, disease_id) => {
  console.log("DELETE FeverWithRash", casebase_id, disease_id);

  await pool.query(
    `DELETE FROM tbl_feverwithrash 
     WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};