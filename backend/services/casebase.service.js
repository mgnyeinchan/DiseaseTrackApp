const model = require('../models/casebase.model');

const Afp = require('../models/afp.model');
const Fever = require('../models/feverwithrash.model');
const Diphtheria = require('../models/diphtheria.model');
const Nnt = require('../models/nnt.model');
const Aes = require('../models/aes.model');
const Whooping = require('../models/whoopingcough.model');
const Meningo = require('../models/meningococcal.model');
const Cholera = require('../models/suspectedcholera.model');

exports.getAll = (params) => model.getAll(params);

exports.getById = async (id) => {
  console.log("🔥 getById HIT");
  // get casebase
  const result = await model.getById(id);
  const casebase = result.rows[0];

  if (!casebase) throw new Error('Not found');

  const disease_id = casebase.disease_id;

  let diseaseData = null;
  // load disease detail
  switch (disease_id) {
    case 1:
      diseaseData = await Afp.getByCasebaseId(id);
      break;
    case 2:
      diseaseData = await Fever.getByCasebaseId(id);
      break;
    case 3:
      diseaseData = await Diphtheria.getByCasebaseId(id);
      break;
    case 4:
      diseaseData = await Nnt.getByCasebaseId(id);
      break;
    case 5:
      diseaseData = await Aes.getByCasebaseId(id);
      break;
    case 6:
      diseaseData = await Whooping.getByCasebaseId(id);
      break;
    case 7:
      diseaseData = await Meningo.getByCasebaseId(id);
      break;
    case 8:
      diseaseData = await Cholera.getByCasebaseId(id);
      break;
  }
  
  console.log("AFP QUERY 👉", diseaseData.rows);
  return {
    ...casebase,
    disease_detail: diseaseData?.rows?.[0] || null
  };
};


// 🔥 helper (mapping)
const diseaseMap = {
  1: {
    create: Afp.createAFP,
    update: Afp.updateAFP,
    delete: Afp.deleteAFP
  },
  2: {
    create: Fever.createFeverWithRash,
    update: Fever.updateFeverWithRash,
    delete: Fever.deleteFeverWithRash
  },
  3: {
    create: Diphtheria.createDiphtheria,
    update: Diphtheria.updateDiphtheria,
    delete: Diphtheria.deleteDiphtheria
  },
  4: {
    create: Nnt.createNNT,
    update: Nnt.updateNNT,
    delete: Nnt.deleteNNT
  },
  5: {
    create: Aes.createAES,
    update: Aes.updateAES,
    delete: Aes.deleteAES
  },
  6: {
    create: Whooping.createWhoopingCough,
    update: Whooping.updateWhoopingCough,
    delete: Whooping.deleteWhoopingCough
  },
  7: {
    create: Meningo.createMeningococcal,
    update: Meningo.updateMeningococcal,
    delete: Meningo.deleteMeningococcal
  },
  8: {
    create: Cholera.createCholera,
    update: Cholera.updateCholera,
    delete: Cholera.deleteCholera
  }
};


exports.create = async (data) => {
  if (!data.patient_name) throw new Error('Patient name required');
  if (!data.gender) throw new Error('Gender required');
  if (!data.tsp_id) throw new Error('Township required');

  // create casebase
  const result = await model.create(data);
  const casebase = result.rows[0];

  const disease_id = data.disease_id;
  const disease = diseaseMap[disease_id];

  // create disease table
  if (disease) {

    let detailData = null;

    // 🔥 IMPORTANT FIX
    if (disease_id === 1) detailData = data.afp;
    else if (disease_id === 2) detailData = data.fever;
    else if (disease_id === 3) detailData = data.diphtheria;
    else if (disease_id === 4) detailData = data.nnt;
    else if (disease_id === 5) detailData = data.aes;
    else if (disease_id === 6) detailData = data.whooping;
    else if (disease_id === 7) detailData = data.meningo;
    else if (disease_id === 8) detailData = data.cholera;

    console.log(detailData);
    console.log(casebase.casebase_id);
    console.log(disease_id);
    if (detailData) {
      await disease.create({
        ...detailData, // 🔥 THIS IS KEY
        casebase_id: casebase.casebase_id,
        disease_id
      });
    }
  }

  return result;
};


exports.update = async (id, data) => {
  if (!data.patient_name) throw new Error('Patient name required');

  const result = await model.update(id, data);

  const disease_id = data.disease_id;
  const disease = diseaseMap[disease_id];

  if (disease) {

    let detailData = null;

    if (disease_id === 1) detailData = data.afp;
    else if (disease_id === 2) detailData = data.fever;
    else if (disease_id === 3) detailData = data.diphtheria;
    else if (disease_id === 4) detailData = data.nnt;
    else if (disease_id === 5) detailData = data.aes;
    else if (disease_id === 6) detailData = data.whooping;
    else if (disease_id === 7) detailData = data.meningo;
    else if (disease_id === 8) detailData = data.cholera;

    if (detailData) {
      await disease.update(id, disease_id, detailData);
    }
  }

  return result;
};


// ================= DELETE =================
exports.remove = async (id) => {
  // 🔥 first get disease_id
  const existing = await model.getById(id);
  const casebase = existing.rows[0];

  if (!casebase) throw new Error('Not found');

  const disease_id = casebase.disease_id;
  const disease = diseaseMap[disease_id];

  // 1️⃣ delete disease table
  if (disease) {
    await disease.delete(id, disease_id);
  }

  // 2️⃣ delete casebase
  return model.remove(id);
};