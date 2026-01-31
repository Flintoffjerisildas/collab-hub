const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Please add a workspace name');
        }

        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user.id,
            members: [
                {
                    user: req.user.id,
                    role: 'admin',
                },
            ],
        });

        // Add workspace to user's workspaces list
        await User.findByIdAndUpdate(req.user.id, {
            $push: { workspaces: workspace._id },
        });

        res.status(201).json(workspace);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get user workspaces
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
    try {
        // Find workspaces where user is owner OR member
        // The query checks if the members array contains an object with user: req.user.id
        const workspaces = await Workspace.find({
            'members.user': req.user.id,
        }).populate('owner', 'name email avatar');

        res.status(200).json(workspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get workspace by ID
// @route   GET /api/workspaces/:id
// @access  Private
const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        if (!workspace) {
            res.status(404);
            throw new Error('Workspace not found');
        }

        // Check if user is a member
        const isMember = workspace.members.some(member => member.user._id.toString() === req.user.id);

        if (!isMember) {
            res.status(401);
            throw new Error('Not authorized to view this workspace');
        }

        res.status(200).json(workspace);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
}

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            res.status(404);
            throw new Error('Workspace not found');
        }

        // Verify ownership (Only owner can delete)
        if (workspace.owner.toString() !== req.user.id) {
            res.status(403);
            throw new Error('User not authorized. Only the workspace owner can delete it.');
        }

        // 1. Find all projects in workspace
        const Project = require('../models/Project');
        const Task = require('../models/Task');

        const projects = await Project.find({ workspace: workspace._id });

        // 2. Delete all tasks for these projects
        const projectIds = projects.map(p => p._id);
        await Task.deleteMany({ project: { $in: projectIds } });

        // 3. Delete all projects
        await Project.deleteMany({ workspace: workspace._id });

        // 4. Remove workspace reference from all Users (optional but good for cleanup)
        // This might be heavy if many users, but essential for consistency
        await User.updateMany(
            { workspaces: workspace._id },
            { $pull: { workspaces: workspace._id } }
        );

        // 5. Delete workspace
        await workspace.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Workspace deleted successfully' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    deleteWorkspace
};
