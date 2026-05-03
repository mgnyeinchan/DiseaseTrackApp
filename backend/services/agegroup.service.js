const model = require('../models/agegroup.model');

exports.getDropdown = async () => {
  return model.getDropdown();
};