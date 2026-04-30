const model = require('../models/disease.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return model.getById(id);
};

exports.create = async (data) => {
  if (!data.disease_name) throw new Error('Disease name is required');

  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.disease_name) throw new Error('Disease name is required');

  return model.update(id, data);
};

exports.remove = async (id) => {
  return model.remove(id);
};

exports.dropdown = async () => {
  return model.dropdown();
};