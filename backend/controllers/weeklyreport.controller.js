const service = require('../services/weeklyreport.service');

exports.getAll = async (req, res) => {
  try {
    const { page, limit, year, week, facility_id } = req.query;

    const result = await service.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      year,
      week,
      facility_id
    });

    res.json({
      data: result.rows,
      meta: {
        total: result.total
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await service.getById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: 'Deleted successfully' });
};