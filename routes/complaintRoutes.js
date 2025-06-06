const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, complaintController.getAll);
router.post('/', auth, complaintController.create);
router.put('/:id/status', auth, complaintController.updateStatus);
router.delete('/:id', auth, complaintController.remove);

module.exports = router;
