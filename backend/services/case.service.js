const caseModel = require('../models/case.model');

exports.createCase = async (data) => {
  if (!data.name || !data.age) {
    throw new Error('Name and age are required');
  }

  return caseModel.create(data);
};

exports.getCases = async () => {
  return caseModel.findAll();
};

exports.updateCase = async (id, data) => {
  return caseModel.update(id, data);
};

exports.deleteCase = async (id) => {
  return caseModel.remove(id);
};