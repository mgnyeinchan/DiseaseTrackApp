const model = require('../models/township.model');

exports.getAll = async (params) => {
  return model.getAll(params);
};

exports.create = async (data) => {
  if (!data.tsp_code) throw new Error('Township code is required');
  if (!data.tsp_name) throw new Error('Township name is required');
  if (!data.tps_div_id) throw new Error('Division is required');

  return model.create(data);
};

exports.update = async (id, data) => {
  if (!data.tsp_code) throw new Error('Township code is required');
  if (!data.tsp_name) throw new Error('Township name is required');
  if (!data.tps_div_id) throw new Error('Division is required');

  return model.update(id, data);
};

exports.remove = async (id) => {
  return model.remove(id);
};

exports.getDropdown = async () => {
  return model.getDropdown();
};