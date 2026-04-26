const service = require('../services/division.service');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;

    const result = await service.getAll({ page, limit, search });

    res.json({
      data: result.rows,
      meta: {
        page,
        limit,
        total: result.total
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllDivision = async (req, res) => {
  try {
    const result = await service.getAllDivision();

    // 🔥 dropdown use အတွက် simple response
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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