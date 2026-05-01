const pool = require('./db');

exports.getByCasebaseId = async (casebase_id) => {
  return await pool.query(
    `SELECT * FROM tbl_diphtheria WHERE casebase_id=$1`,
    [casebase_id]
  );
};

exports.createDiphtheria = async (data) => {
  const result = await pool.query(
    `INSERT INTO tbl_diphtheria (
      casebase_id, disease_id,
      dpt_vaccine, fever_start_date, fever, sore_throat,
      difficulty_swallowing, stridor, tonsil_swelling,
      voice_change, tachycardia, neck_swelling,
      weakness, membrane_present, complications,
      airway_block, myocarditis, patient_status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    ) RETURNING *`,
    Object.values(data)
  );
  return result.rows[0];
};

exports.updateDiphtheria = async (casebase_id, disease_id, data) => {
  const result = await pool.query(
    `UPDATE tbl_diphtheria SET
      dpt_vaccine=$1, fever_start_date=$2, fever=$3,
      sore_throat=$4, difficulty_swallowing=$5,
      stridor=$6, tonsil_swelling=$7, voice_change=$8,
      tachycardia=$9, neck_swelling=$10, weakness=$11,
      membrane_present=$12, complications=$13,
      airway_block=$14, myocarditis=$15, patient_status=$16,
      updated_at=NOW()
     WHERE casebase_id=$17 AND disease_id=$18
     RETURNING *`,
    [
      data.dpt_vaccine,
      data.fever_start_date,
      data.fever,
      data.sore_throat,
      data.difficulty_swallowing,
      data.stridor,
      data.tonsil_swelling,
      data.voice_change,
      data.tachycardia,
      data.neck_swelling,
      data.weakness,
      data.membrane_present,
      data.complications,
      data.airway_block,
      data.myocarditis,
      data.patient_status,
      casebase_id,
      disease_id
    ]
  );
  return result.rows[0];
};

exports.deleteDiphtheria = async (casebase_id, disease_id) => {
  await pool.query(
    `DELETE FROM tbl_diphtheria WHERE casebase_id=$1 AND disease_id=$2`,
    [casebase_id, disease_id]
  );
};