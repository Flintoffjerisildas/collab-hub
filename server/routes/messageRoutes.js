const express = require('express');
const router = express.Router();
const { sendMessage, getProjectMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/:projectId', protect, getProjectMessages);

module.exports = router;
