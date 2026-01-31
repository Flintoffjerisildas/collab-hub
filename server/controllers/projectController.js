const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { name, description, workspaceId, visibility, category } = req.body;

        if (!name || !workspaceId) {
            res.status(400);
            throw new Error('Please add a name and workspace ID');
        }

        // Verify workspace exists and user is member
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            res.status(404);
            throw new Error('Workspace not found');
        }

        // Check membership (simple check for now)
        const isMember = workspace.members.some(member => member.user.toString() === req.user.id);
        if (!isMember) {
            res.status(401);
            throw new Error('Not authorized to create project in this workspace');
        }

        const project = await Project.create({
            name,
            description,
            workspace: workspaceId,
            owner: req.user.id,
            members: [req.user.id], // Creator is first member
            visibility,
            category
        });

        // Add project to workspace
        workspace.projects.push(project._id);
        await workspace.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get projects for a workspace
// @route   GET /api/projects/workspace/:workspaceId
// @access  Private
const getWorkspaceProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Verify workspace access logic here if needed (omitted for brevity, usually strict)

        const projects = await Project.find({ workspace: workspaceId })
            .populate('owner', 'name avatar')
            .populate('members', 'name avatar');

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Ensure owner is included in members list for frontend consistency
        // (In case of old projects where owner wasn't pushed to members array)
        const projectData = project.toObject();
        const ownerInMembers = projectData.members.some(m => m._id.toString() === projectData.owner._id.toString());

        if (!ownerInMembers) {
            projectData.members.unshift(projectData.owner);
        }

        res.status(200).json(projectData);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
}

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Verify ownership/admin (only owner can add members for now)
        if (project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to add members');
        }

        const userToAdd = await require('../models/User').findOne({ email });

        if (!userToAdd) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if already a member of PROJECT
        if (project.members.includes(userToAdd._id)) {
            res.status(400);
            throw new Error('User is already a member');
        }

        // Add to Project
        project.members.push(userToAdd._id);
        await project.save();

        // --- NEW: Add to Workspace if not already there ---
        const workspace = await Workspace.findById(project.workspace);
        if (workspace) {
            const isWorkspaceMember = workspace.members.some(
                (member) => member.user.toString() === userToAdd._id.toString()
            );

            if (!isWorkspaceMember) {
                workspace.members.push({
                    user: userToAdd._id,
                    role: 'member',
                });
                await workspace.save();

                // Also update User's workspaces array to keep it in sync (if used)
                await require('../models/User').findByIdAndUpdate(userToAdd._id, {
                    $addToSet: { workspaces: workspace._id }
                });
            }
        }
        // --------------------------------------------------

        const updatedProject = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        // Create Notification
        const Notification = require('../models/Notification');
        const notification = await Notification.create({
            recipient: userToAdd._id,
            sender: req.user.id,
            type: 'project_invite',
            reference: project._id,
            message: `${req.user.name} added you to project '${project.name}'`
        });

        // Emit Socket Event
        const io = req.app.get('io');
        if (io) {
            io.to(userToAdd._id.toString()).emit('new_notification', notification);
            // Note: For this to work, the user must have joined a room named after their userId. 
            // We need to ensure client joins their own room on connection.
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Verify ownership
        if (project.owner.toString() !== req.user.id) {
            res.status(403);
            throw new Error('User not authorized to delete this project. Only the project owner can delete it.');
        }

        // Delete all tasks associated with the project
        await require('../models/Task').deleteMany({ project: project._id });

        // Remove project from workspace
        const workspace = await Workspace.findById(project.workspace);
        if (workspace) {
            workspace.projects = workspace.projects.filter(
                (pId) => pId.toString() !== project._id.toString()
            );
            await workspace.save();
        }

        await project.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getWorkspaceProjects,
    getProjectById,
    addMember,
    deleteProject
};
