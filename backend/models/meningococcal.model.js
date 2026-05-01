const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  return await pool.query(
    `SELECT * FROM tbl_meningococcal WHERE casebase_id=$1`,
    [casebase_id]
  );
};

exports.createMeningococcal = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_meningococcal (
      casebase_id, disease_id,
      meningococcal_vaccine, onset_date, rapid_onset,
      fever, diarrhea, headache, vomiting, shock,
      kernig_sign, mental_change, rash, convulsion,
      muscle_pain, anemia, neck_stiffness,
      clinical_diagnosis, travel_history, patient_status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
    ) RETURNING *`,
    Object.values(data)
  );
  return result.rows[0];
};

exports.updateMeningococcal = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_meningococcal SET
      meningococcal_vaccine=$1, onset_date=$2, rapid_onset=$3,
      fever=$4, diarrhea=$5, headache=$6, vomiting=$7,
      shock=$8, kernig_sign=$9, mental_change=$10,
      rash=$11, convulsion=$12, muscle_pain=$13,
      anemia=$14, neck_stiffness=$15,
      clinical_diagnosis=$16, travel_history=$17,
      patient_status=$18, updated_at=NOW()
     WHERE casebase_id=$19 AND disease_id=$20
     RETURNING *`,
    [
      data.meningococcal_vaccine,
      data.onset_date,
      data.rapid_onset,
      data.fever,
      data.diarrhea,
      data.headache,
      data.vomiting,
      data.shock,
      data.kernig_sign,
      data.mental_change,
      data.rash,
      data.convulsion,
      data.muscle_pain,
      data.anemia,
      data.neck_stiffness,
      data.clinical_diagnosis,
      data.travel_history,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

exports.deleteMeningococcal = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_meningococcal WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};