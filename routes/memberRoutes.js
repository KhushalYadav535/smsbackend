const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, memberController.getAll);
router.get('/:id', auth, memberController.getById);
router.post('/', auth, memberController.create);
router.put('/:id', auth, memberController.update);
router.delete('/:id', auth, memberController.remove);

module.exports = router;
