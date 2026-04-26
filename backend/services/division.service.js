const model = require('../models/division.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};
exports.getAllDivision = async () => {
  return await model.getAllDivision();
};
exports.getById = async (id) => {
  return await model.getById(id);
};

exports.create = async (data) => {
  if (!data.div_code) throw new Error('Division code is required');
  if (!data.div_name) throw new Error('Division name is required');

  return await model.create(data);
};

exports.update = async (id, data) => {
  if (!data.div_code) throw new Error('Division code is required');
  if (!data.div_name) throw new Error('Division name is required');

  return await model.update(id, data);
};

exports.remove = async (id) => {
  return await model.remove(id);
};