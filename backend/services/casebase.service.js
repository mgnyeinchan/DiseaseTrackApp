const model = require('../models/casebase.model');

exports.getAll = (params) => model.getAll(params);

exports.getById = (id) => model.getById(id);

exports.create = (data) => {
  if (!data.patient_name) throw new Error('Patient name required');
  if (!data.gender) throw new Error('Gender required');
  if (!data.tsp_id) throw new Error('Township required');

  return model.create(data);
};

exports.update = (id, data) => {
  if (!data.patient_name) throw new Error('Patient name required');
  return model.update(id, data);
};

exports.remove = (id) => model.remove(id);