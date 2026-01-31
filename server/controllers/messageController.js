const Message = require('../models/Message');
const Project = require('../models/Project');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { content, projectId } = req.body;

        if (!content || !projectId) {
            res.status(400);
            throw new Error('Please add content and project ID');
        }

        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Check if user is member (optional but recommended)
        /*
        const isMember = project.members.some(member => member.user.toString() === req.user.id);
        if(!isMember && project.owner.toString() !== req.user.id) {
             res.status(401);
             throw new Error('Not authorized to send messages in this project');
        }
        */

        var message = await Message.create({
            sender: req.user._id,
            content: content,
            project: projectId,
            readBy: [req.user._id]
        });

        message = await message.populate('sender', 'name avatar email');
        message = await message.populate('project');

        res.status(201).json(message);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get all messages for a project
// @route   GET /api/messages/:projectId
// @access  Private
const getProjectMessages = async (req, res) => {
    try {
        const messages = await Message.find({ project: req.params.projectId })
            .populate('sender', 'name avatar email')
            .sort({ createdAt: 1 }); // Oldest first (chat history style) or -1 for newest

        res.status(200).json(messages);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getProjectMessages,
};
