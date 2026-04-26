const model = require('../models/project.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return await model.getById(id);
};

exports.create = async (data) => {
  if (!data.project_code) {
    throw new Error('Project code is required');
  }

  if (!data.project_name) {
    throw new Error('Project name is required');
  }
  return await model.create(data);
};

exports.update = async (id, data) => {
  if (!data.project_code) {
    throw new Error('Project code is required');
  }

  if (!data.project_name) {
    throw new Error('Project name is required');
  }
  return await model.update(id, data);
};

exports.remove = async (id) => {
  return await model.remove(id);
};