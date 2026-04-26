const service = require('../services/project.service');

exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || null;
  const status = req.query.status || null;

  const result = await service.getAll({
    page,
    limit,
    search,
    status
  });

  res.json({
    data: result.rows
  });
};

exports.getById = async (req, res) => {
  const result = await service.getById(req.params.id);
  res.json(result.rows[0]);
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
  const result = await service.update(req.params.id, req.body);
  res.json(result.rows[0]);
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: 'Deleted successfully' });
};