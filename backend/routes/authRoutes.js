const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', login);

router.post('/register', register);

// Protected routes
router.use(verifyToken);

module.exports = router;