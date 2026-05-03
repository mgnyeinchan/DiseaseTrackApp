const service = require('../services/agegroup.service');

exports.getDropdown = async (req, res) => {
  try {
    const result = await service.getDropdown();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};