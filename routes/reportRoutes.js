const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, reportController.getAll);
router.post('/', auth, reportController.create);
router.delete('/:id', auth, reportController.remove);

module.exports = router;
