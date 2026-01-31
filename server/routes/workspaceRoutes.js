const express = require('express');
const router = express.Router();
const { createWorkspace, getWorkspaces, getWorkspaceById, deleteWorkspace } = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);
router.route('/:id').get(protect, getWorkspaceById).delete(protect, deleteWorkspace);

module.exports = router;
