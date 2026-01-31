const express = require('express');
const router = express.Router();
const { createProject, getWorkspaceProjects, getProjectById, addMember, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createProject);
router.route('/workspace/:workspaceId').get(protect, getWorkspaceProjects);
router.route('/:id').get(protect, getProjectById).delete(protect, deleteProject);
router.route('/:id/members').post(protect, addMember);

module.exports = router;
