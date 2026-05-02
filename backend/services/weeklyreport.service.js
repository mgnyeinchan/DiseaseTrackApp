const db = require('../models/db');
const WeeklyModel = require('../models/weeklyreport.model');
const DiseaseReportModel = require('../models/diseasereport.model');

// 🔹 GET ALL
exports.getAll = async (params) => {
  return WeeklyModel.getAll(params);
};

// 🔹 GET BY ID (with diseases)
exports.getById = async (id) => {
  const weekly = await WeeklyModel.getById(id);

  if (!weekly.rows.length) {
    throw new Error('Weekly report not found');
  }

  const diseases = await DiseaseReportModel.getByWeeklyReportId(id);

  return {
    ...weekly.rows[0],
    diseases: diseases.rows
  };
};

// 🔹 VALIDATION
const validate = (data) => {
  if (!data.reporter_name) throw new Error('Reporter name is required');
  if (!data.reporter_position) throw new Error('Reporter position is required');
  if (!data.report_date) throw new Error('Report date is required');
  if (!data.report_week) throw new Error('Report week is required');
  if (!data.report_year) throw new Error('Report year is required');
  if (!data.facility_id) throw new Error('Facility is required');
};

// 🔹 CREATE (WITH DISEASES)
exports.create = async (data) => {
  validate(data);

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. create weekly report
    const result = await WeeklyModel.create(data, client);
    const weeklyId = result.rows[0].id;

    // 2. insert diseases (only if exist)
    if (data.diseases && data.diseases.length > 0) {
      await DiseaseReportModel.createBulk(weeklyId, data.diseases, client);
    }

    await client.query('COMMIT');

    return result;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// 🔹 UPDATE (WITH REPLACE DISEASES)
exports.update = async (id, data) => {
  validate(data);

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. update weekly
    const result = await WeeklyModel.update(id, data, client);

    // 2. replace diseases
    if (data.diseases) {
      await DiseaseReportModel.replaceAll(id, data.diseases, client);
    }

    await client.query('COMMIT');

    return result;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// 🔹 DELETE (CASCADE auto delete diseases)
exports.remove = async (id) => {
  return WeeklyModel.remove(id);
};