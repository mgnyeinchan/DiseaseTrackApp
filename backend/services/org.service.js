const model = require('../models/org.model');

exports.getAll = (params) => model.getAll(params);

exports.getById = (id) => model.getById(id);

exports.create = async (data) => {
  if (!data.org_code || !data.org_name) {
    throw new Error('org_code and org_name are required');
  }
  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.org_code || !data.org_name) {
    throw new Error('org_code and org_name are required');
  }
  return model.update(id, data);
};

exports.remove = (id) => model.remove(id);

exports.dropdown = async () => {
  return model.dropdown();
};