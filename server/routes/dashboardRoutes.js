const express = require('express');
const router = express.Router();
const { getDashboardStats, getMyTasks } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/tasks', protect, getMyTasks);

module.exports = router;
