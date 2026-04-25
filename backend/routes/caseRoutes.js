const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const {
  createCase,
  getCases,
  updateCase,
  deleteCase
} = require('../controllers/caseController');

router.use(verifyToken);
router.post('/', createCase);
router.get('/', getCases);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

module.exports = router;