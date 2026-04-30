const service = require('../services/facility.service');

exports.getAll = async (req, res) => {
  try {
    const { page, limit, search, div_id, tsp_id, org_id } = req.query;

    const result = await service.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search,
      div_id,
      tsp_id,
      org_id
    });

    res.json({
      data: result.rows,
      meta: { total: result.total }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  const result = await service.getById(req.params.id);
  res.json(result.rows[0]);
};

exports.create = async (req, res) => {
  const result = await service.create(req.body);
  res.json(result.rows[0]);
};

exports.update = async (req, res) => {
  const result = await service.update(req.params.id, req.body);
  res.json(result.rows[0]);
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.dropdown = async (req, res) => {
  try {
    const result = await service.dropdown();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};