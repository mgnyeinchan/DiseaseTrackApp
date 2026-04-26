const model = require('../models/project.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return await model.getById(id);
};

exports.create = async (data) => {
  if (!data.project_code || !data.project_name) {
    throw new Error('Required fields missing');
  }

  return await model.create(data);
};

exports.update = async (id, data) => {
  return await model.update(id, data);
};

exports.remove = async (id) => {
  return await model.remove(id);
};