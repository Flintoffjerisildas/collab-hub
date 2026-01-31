const Project = require('../models/Project');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// @desc    Get dashboard stats (project counts, task counts)
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Count active projects (where user is owner or member)
        const projectCount = await Project.countDocuments({
            members: userId
        });

        // Count pending tasks assigned to user
        const pendingTaskCount = await Task.countDocuments({
            assignee: userId,
            status: { $ne: 'done' }
        });

        // Count workspaces
        const workspaceCount = await Workspace.countDocuments({
            'members.user': userId
        });

        res.status(200).json({
            projectCount,
            pendingTaskCount,
            workspaceCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks assigned to current user
// @route   GET /api/dashboard/tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await Task.find({
            assignee: userId,
            status: { $ne: 'done' }
        })
            .populate('project', 'name')
            .sort({ dueDate: 1, order: 1 })
            .limit(10); // Limit to 10 most receiving/urgent tasks

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getMyTasks
};
