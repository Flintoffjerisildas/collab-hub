const express = require('express');
const router = express.Router();
const {
    githubAuth,
    githubCallback,
    getRepos,
    linkProject,
    syncIssues
} = require('../controllers/githubController');
const { protect } = require('../middleware/auth');

router.get('/auth', protect, githubAuth);
router.post('/callback', protect, githubCallback);
router.get('/repos', protect, getRepos);
router.post('/projects/:projectId/link', protect, linkProject);
router.post('/projects/:projectId/sync', protect, syncIssues);

module.exports = router;
