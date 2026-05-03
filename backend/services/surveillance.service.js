const model = require('../models/surveillance.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.getById = async (id) => {
  return model.getById(id);
};

exports.create = async (data) => {
  if (!data.facility_id) throw new Error('Facility is required');
  if (!data.report_date) throw new Error('Report date is required');

  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.facility_id) throw new Error('Facility is required');
  if (!data.report_date) throw new Error('Report date is required');

  return model.update(id, data);
};

exports.remove = async (id) => {
  return model.remove(id);
};