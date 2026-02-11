const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Redirect to GitHub OAuth
// @route   GET /api/github/auth
// @access  Private
const githubAuth = (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    const scope = 'user repo';

    // Check if we already have the user's ID to associate after callback
    // We can pass it in state, but simpler for now is to handle it on frontend or 
    // rely on the user being logged in when they hit the callback if we want to associate. 
    // Actually, usually we initiate from frontend which already has token.
    // So the frontend will open a popup or redirect.

    // Better approach: User clicks "Connect GitHub" on frontend -> Frontend calls this or constructs URL.
    // If we use this endpoint, we redirect.

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.json({ url });
};

// @desc    GitHub OAuth Callback
// @route   POST /api/github/callback
// @access  Private
const githubCallback = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('No code provided');
    }

    try {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }, {
            headers: {
                Accept: 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            res.status(400);
            throw new Error('Failed to obtain access token');
        }

        // Get User Details
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const githubUser = userResponse.data;

        // Update User in DB
        // Assuming the user is already authenticated and we have their ID in req.user
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.githubId = githubUser.id;
        user.githubAccessToken = accessToken;
        user.githubUsername = githubUser.login;

        await user.save();

        res.json({
            message: 'GitHub connected successfully',
            githubUsername: githubUser.login
        });

    } catch (error) {
        console.error('GitHub Callback Error:', error.response?.data || error.message);
        res.status(500);
        throw new Error('GitHub authentication failed');
    }
};

// @desc    Get User Repositories
// @route   GET /api/github/repos
// @access  Private
const getRepos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.githubAccessToken) {
            res.status(400);
            throw new Error('GitHub not connected');
        }

        const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `Bearer ${user.githubAccessToken}`
            }
        });

        res.json(response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            html_url: repo.html_url,
            description: repo.description,
            owner: repo.owner.login
        })));
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch repositories');
    }
};

// @desc    Link Project to GitHub Repo
// @route   POST /api/github/projects/:projectId/link
// @access  Private
const linkProject = async (req, res) => {
    const { projectId } = req.params;
    const { repoOwner, repoName } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Verify ownership or permissions if needed

    project.githubRepoOwner = repoOwner;
    project.githubRepoName = repoName;
    await project.save();

    res.json(project);
};

// @desc    Sync Issues to Tasks
// @route   POST /api/github/projects/:projectId/sync
// @access  Private
const syncIssues = async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project || !project.githubRepoOwner || !project.githubRepoName) {
        res.status(400);
        throw new Error('Project not linked to GitHub');
    }

    const user = await User.findById(req.user.id);
    if (!user.githubAccessToken) {
        res.status(400);
        throw new Error('User not connected to GitHub');
    }

    try {
        const response = await axios.get(`https://api.github.com/repos/${project.githubRepoOwner}/${project.githubRepoName}/issues?state=open`, {
            headers: {
                Authorization: `Bearer ${user.githubAccessToken}`
            }
        });

        const issues = response.data;
        const tasks = [];

        for (const issue of issues) {
            // Check if task already exists
            const existingTask = await Task.findOne({
                project: projectId,
                githubIssueId: issue.id
            });

            if (!existingTask) {
                const newTask = await Task.create({
                    name: issue.title,
                    description: issue.body || '',
                    project: projectId,
                    workspace: project.workspace,
                    status: 'todo', // Default
                    priority: 'medium',
                    createdBy: req.user.id,
                    githubIssueId: issue.id,
                    githubIssueUrl: issue.html_url
                });
                tasks.push(newTask);
            }
        }

        res.json({ message: `Synced ${tasks.length} new tasks from GitHub issues`, tasks });

    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Failed to sync issues');
    }
};



// @desc    Get Project Commits
// @route   GET /api/github/projects/:projectId/commits
// @access  Private
const getCommits = async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project || !project.githubRepoOwner || !project.githubRepoName) {
        res.status(400);
        throw new Error('Project not linked to GitHub');
    }

    const user = await User.findById(req.user.id);
    if (!user.githubAccessToken) {
        res.status(400);
        throw new Error('User not connected to GitHub');
    }

    try {
        const response = await axios.get(`https://api.github.com/repos/${project.githubRepoOwner}/${project.githubRepoName}/commits?per_page=20`, {
            headers: {
                Authorization: `Bearer ${user.githubAccessToken}`
            }
        });

        const commits = response.data.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: {
                name: commit.commit.author.name,
                email: commit.commit.author.email,
                date: commit.commit.author.date,
                avatar_url: commit.author ? commit.author.avatar_url : null,
                html_url: commit.author ? commit.author.html_url : null
            },
            html_url: commit.html_url
        }));

        res.json(commits);
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Failed to fetch commits');
    }
};

module.exports = {
    githubAuth,
    githubCallback,
    getRepos,
    linkProject,
    syncIssues,
    getCommits
};
