const model = require('../models/clinic.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return model.getById(id);
};

exports.create = async (data) => {
  if (!data.cln_code) throw new Error('Clinic code is required');
  if (!data.cln_name) throw new Error('Clinic name is required');
  if (!data.cln_tsp_id) throw new Error('Township is required');

  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.cln_code) throw new Error('Clinic code is required');
  if (!data.cln_name) throw new Error('Clinic name is required');
  if (!data.cln_tsp_id) throw new Error('Township is required');

  return model.update(id, data);
};

exports.remove = async (id) => {
  return model.remove(id);
};

exports.getDropdown = async () => {
  return model.getDropdown();
};