const model = require('../models/village.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return model.getById(id);
};

exports.create = async (data) => {
  if (!data.village_code) throw new Error('Village code is required');
  if (!data.village_name) throw new Error('Village name is required');
  if (!data.village_tsp_id) throw new Error('Township is required');

  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.village_code) throw new Error('Village code is required');
  if (!data.village_name) throw new Error('Village name is required');
  if (!data.village_tsp_id) throw new Error('Township is required');

  return model.update(id, data);
};

exports.remove = async (id) => {
  return model.remove(id);
};

exports.dropdown = () => model.dropdown();