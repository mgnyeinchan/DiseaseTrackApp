const db = require('../models/db');
const model = require('../models/casebase.model');

const Afp = require('../models/afp.model');
const Fever = require('../models/feverwithrash.model');
const Diphtheria = require('../models/diphtheria.model');
const Nnt = require('../models/nnt.model');
const Aes = require('../models/aes.model');
const Whooping = require('../models/whoopingcough.model');
const Meningo = require('../models/meningococcal.model');
const Cholera = require('../models/suspectedcholera.model');

// ================= GET =================
exports.getAll = (params) => model.getAll(params);

exports.getById = async (id) => {
  const result = await model.getById(id);
  const casebase = result.rows[0];

  if (!casebase) throw new Error('Not found');

  const disease_id = casebase.disease_id;

  let diseaseData = null;

  switch (disease_id) {
    case 1: diseaseData = await Afp.getByCasebaseId(id); break;
    case 2: diseaseData = await Fever.getByCasebaseId(id); break;
    case 3: diseaseData = await Diphtheria.getByCasebaseId(id); break;
    case 4: diseaseData = await Nnt.getByCasebaseId(id); break;
    case 5: diseaseData = await Aes.getByCasebaseId(id); break;
    case 6: diseaseData = await Whooping.getByCasebaseId(id); break;
    case 7: diseaseData = await Meningo.getByCasebaseId(id); break;
    case 8: diseaseData = await Cholera.getByCasebaseId(id); break;
  }

  return {
    ...casebase,
    disease_detail: diseaseData?.rows?.[0] || null
  };
};

// ================= DISEASE MAP =================
const diseaseMap = {
  1: { create: Afp.createAFP, update: Afp.updateAFP, delete: Afp.deleteAFP },
  2: { create: Fever.createFeverWithRash, update: Fever.updateFeverWithRash, delete: Fever.deleteFeverWithRash },
  3: { create: Diphtheria.createDiphtheria, update: Diphtheria.updateDiphtheria, delete: Diphtheria.deleteDiphtheria },
  4: { create: Nnt.createNNT, update: Nnt.updateNNT, delete: Nnt.deleteNNT },
  5: { create: Aes.createAES, update: Aes.updateAES, delete: Aes.deleteAES },
  6: { create: Whooping.createWhoopingCough, update: Whooping.updateWhoopingCough, delete: Whooping.deleteWhoopingCough },
  7: { create: Meningo.createMeningococcal, update: Meningo.updateMeningococcal, delete: Meningo.deleteMeningococcal },
  8: { create: Cholera.createCholera, update: Cholera.updateCholera, delete: Cholera.deleteCholera }
};

// ================= HELPER =================
const getDetailData = (disease_id, data) => {
  if (disease_id === 1) return data.afp;
  if (disease_id === 2) return data.fever;
  if (disease_id === 3) return data.diphtheria;
  if (disease_id === 4) return data.nnt;
  if (disease_id === 5) return data.aes;
  if (disease_id === 6) return data.whooping;
  if (disease_id === 7) return data.meningo;
  if (disease_id === 8) return data.cholera;
  return null;
};

// ================= CREATE =================
exports.create = async (data) => {
  if (!data.patient_name) throw new Error('Patient name required');
  if (!data.gender) throw new Error('Gender required');
  if (!data.tsp_id) throw new Error('Township required');

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. create casebase
    const result = await model.create(data, client);
    const casebase = result.rows[0];

    const disease_id = data.disease_id;
    const disease = diseaseMap[disease_id];

    // 2. create disease detail
    if (disease) {
      const detailData = getDetailData(disease_id, data);

      if (detailData) {
        await disease.create({
          ...detailData,
          casebase_id: casebase.casebase_id,
          disease_id
        }, client); // 🔥 pass client
      }
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

// ================= UPDATE =================
exports.update = async (id, data) => {
  if (!data.patient_name) throw new Error('Patient name required');

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. update casebase
    const result = await model.update(id, data, client);

    const disease_id = data.disease_id;
    const disease = diseaseMap[disease_id];

    // 2. update disease detail
    if (disease) {
      const detailData = getDetailData(disease_id, data);

      if (detailData) {
        await disease.update(id, disease_id, detailData, client);
      }
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

// ================= DELETE =================
exports.remove = async (id) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const existing = await model.getById(id);
    const casebase = existing.rows[0];

    if (!casebase) throw new Error('Not found');

    const disease_id = casebase.disease_id;
    const disease = diseaseMap[disease_id];

    // 1. delete disease
    if (disease) {
      await disease.delete(id, disease_id, client);
    }

    // 2. delete casebase
    const result = await model.remove(id, client);

    await client.query('COMMIT');
    return result;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};