const caseService = require('../services/case.service');

// CREATE
exports.createCase = async (req, res) => {
  try {
    const data = await caseService.createCase(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ
exports.getCases = async (req, res) => {
  try {
    const data = await caseService.getCases();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateCase = async (req, res) => {
  try {
    await caseService.updateCase(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteCase = async (req, res) => {
  try {
    await caseService.deleteCase(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};