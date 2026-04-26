const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/register', register);

// protected example
router.get('/me', verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;