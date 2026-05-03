const express = require('express');
const router = express.Router();

const controller = require('../controllers/agegroup.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/dropdown', verifyToken, controller.getDropdown);

module.exports = router;