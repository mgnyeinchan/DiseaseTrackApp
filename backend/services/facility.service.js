const model = require('../models/facility.model');

exports.getAll = (params) => model.getAll(params);

exports.create = (data) => {
  if (!data.facility_code) throw new Error('Code required');
  if (!data.facility_name) throw new Error('Name required');

  return model.create(data);
};

exports.update = (id, data) => {
  if (!data.facility_code) throw new Error('Code required');
  if (!data.facility_name) throw new Error('Name required');

  return model.update(id, data);
};

exports.getById = (id) => model.getById(id);
exports.remove = (id) => model.remove(id);

exports.dropdown = async () => {
  return model.dropdown();
};