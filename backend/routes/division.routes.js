const express = require('express');
const router = express.Router();

const controller = require('../controllers/division.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// 🔐 Protected Routes

// GET all (pagination, search)
router.get('/', verifyToken, controller.getAll);

// GET all (pagination, search)
router.get('/dropdown', verifyToken, controller.getAllDivision);

// GET by id
router.get('/:id', verifyToken, controller.getById);

// CREATE
router.post('/', verifyToken, controller.create);

// UPDATE
router.put('/:id', verifyToken, controller.update);

// DELETE
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;