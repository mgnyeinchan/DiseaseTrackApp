const model = require('../models/awarenesssource.model');

exports.getDropdown = async () => {
  return model.getDropdown();
};