const express = require('express');
const router = express.Router();
const accountingController = require('../controllers/accountingController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, accountingController.getAll);
router.get('/stats', auth, accountingController.getStats);
router.post('/', auth, accountingController.create);
router.delete('/:id', auth, accountingController.remove);

module.exports = router;
