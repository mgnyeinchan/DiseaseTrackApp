const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const {
  createCase,
  getCases,
  updateCase,
  deleteCase
} = require('../controllers/case.controller');

// protect all routes
router.use(verifyToken);

router.post('/', createCase);
router.get('/', getCases);
router.put('/:id', updateCase);

// admin only delete (optional 🔥)
router.delete('/:id', isAdmin, deleteCase);

module.exports = router;