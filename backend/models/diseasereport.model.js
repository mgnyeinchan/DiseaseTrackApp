const db = require('./db');

exports.getByWeeklyReportId = async (weeklyreport_id) => {
  return db.query(
    `SELECT *
     FROM tbl_disease_report
     WHERE weeklyreport_id = $1
     ORDER BY disease_id ASC`,
    [weeklyreport_id]
  );
};

exports.getOne = async (weeklyreport_id, disease_id) => {
  return db.query(
    `SELECT *
     FROM tbl_disease_report
     WHERE weeklyreport_id = $1 AND disease_id = $2`,
    [weeklyreport_id, disease_id]
  );
};


exports.createBulk = async (weeklyreport_id, list) => {
  const queries = list.map(item =>
    db.query(
      `INSERT INTO tbl_disease_report (
        weeklyreport_id,
        disease_id,
        male_under5_cases,
        female_under5_cases,
        male_over5_cases,
        female_over5_cases,
        male_under5_deaths,
        female_under5_deaths,
        male_over5_deaths,
        female_over5_deaths,
        total_cases,
        total_deaths,
        grand_total
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )`,
      [
        weeklyreport_id,
        item.disease_id,
        item.male_under5_cases || 0,
        item.female_under5_cases || 0,
        item.male_over5_cases || 0,
        item.female_over5_cases || 0,
        item.male_under5_deaths || 0,
        item.female_under5_deaths || 0,
        item.male_over5_deaths || 0,
        item.female_over5_deaths || 0,
        item.total_cases || 0,
        item.total_deaths || 0,
        item.grand_total || 0
      ]
    )
  );

  return Promise.all(queries);
};


exports.updateOne = async (weeklyreport_id, disease_id, data) => {
  return db.query(
    `UPDATE tbl_disease_report SET
      male_under5_cases = $3,
      female_under5_cases = $4,
      male_over5_cases = $5,
      female_over5_cases = $6,
      male_under5_deaths = $7,
      female_under5_deaths = $8,
      male_over5_deaths = $9,
      female_over5_deaths = $10,
      total_cases = $11,
      total_deaths = $12,
      grand_total = $13,
      updated_at = NOW()
     WHERE weeklyreport_id = $1
       AND disease_id = $2`,
    [
      weeklyreport_id,
      disease_id,
      data.male_under5_cases || 0,
      data.female_under5_cases || 0,
      data.male_over5_cases || 0,
      data.female_over5_cases || 0,
      data.male_under5_deaths || 0,
      data.female_under5_deaths || 0,
      data.male_over5_deaths || 0,
      data.female_over5_deaths || 0,
      data.total_cases || 0,
      data.total_deaths || 0,
      data.grand_total || 0
    ]
  );
};


exports.replaceAll = async (weeklyreport_id, list) => {
  await db.query(
    `DELETE FROM tbl_disease_report
     WHERE weeklyreport_id = $1`,
    [weeklyreport_id]
  );

  return exports.createBulk(weeklyreport_id, list);
};


exports.deleteByWeeklyReportId = async (weeklyreport_id) => {
  return db.query(
    `DELETE FROM tbl_disease_report
     WHERE weeklyreport_id = $1`,
    [weeklyreport_id]
  );
};

exports.deleteOne = async (weeklyreport_id, disease_id) => {
  return db.query(
    `DELETE FROM tbl_disease_report
     WHERE weeklyreport_id = $1
       AND disease_id = $2`,
    [weeklyreport_id, disease_id]
  );
};