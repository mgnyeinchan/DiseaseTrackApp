const express = require('express');
const router = express.Router();

const controller = require('../controllers/clinic.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, controller.getAll);
router.get('/:id', verifyToken, controller.getById);
router.post('/', verifyToken, controller.create);
router.put('/:id', verifyToken, controller.update);
router.delete('/:id', verifyToken, controller.remove);

// 🔥 dropdown (important for mobile)
router.get('/dropdown', verifyToken, controller.getDropdown);

module.exports = router;