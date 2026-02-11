const Task = require('../models/Task');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { name, description, projectId, assignee, status, priority, dueDate } = req.body;

        if (!name || !projectId) {
            res.status(400);
            throw new Error('Please add name and project ID');
        }

        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Verify user is member of the workspace
        // (You might want to add a robust check here similar to createProject)

        // Get highest order to append to bottom
        const highestOrderTask = await Task.findOne({ project: projectId, status: status || 'todo' }).sort('-order');
        const order = highestOrderTask ? highestOrderTask.order + 1 : 0;

        const task = await Task.create({
            name,
            description,
            project: projectId,
            workspace: project.workspace, // Inherit workspace from project
            assignee,
            status,
            priority,
            dueDate,
            order,
            createdBy: req.user.id
        });

        const populatedTask = await Task.findById(task._id).populate('assignee', 'name avatar email');

        // Notification for Assignee
        if (assignee && assignee !== req.user.id) {
            const Notification = require('../models/Notification');
            const notification = await Notification.create({
                recipient: assignee,
                sender: req.user.id,
                type: 'task_assigned',
                reference: task._id,
                message: `${req.user.name} assigned you a new task: '${task.name}'`
            });

            const io = req.app.get('io');
            if (io) {
                io.to(assignee.toString()).emit('new_notification', notification);
            }
        }

        // Real-time Update for Project Board
        const io = req.app.get('io');
        if (io) {
            io.to(projectId.toString()).emit('task_created', populatedTask);
        }

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getProjectTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignee', 'name avatar email')
            .sort('order');

        // Real-time Update for Project Board
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.projectId.toString()).emit('tasks_loaded', tasks);
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update task (status, order, content)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check permissions (optional: ensure user is workspace member)

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate('assignee', 'name avatar email');

        // Check if assignee changed or status changed to notify ? 
        // For simplicity, let's just notify if assignee is set and different from sender
        // In a real app we would check if (req.body.assignee && req.body.assignee !== task.assignee)
        if (req.body.assignee && req.body.assignee !== req.user.id) {
            const Notification = require('../models/Notification');
            const notification = await Notification.create({
                recipient: req.body.assignee,
                sender: req.user.id,
                type: 'task_assigned',
                reference: updatedTask._id,
                message: `${req.user.name} updated/assigned task: '${updatedTask.name}'`
            });

            const io = req.app.get('io');
            if (io) {
                io.to(req.body.assignee.toString()).emit('new_notification', notification);
            }
        }

        // Real-time Update for Project Board
        const io = req.app.get('io');
        if (io) {
            io.to(task.project.toString()).emit('task_updated', updatedTask);
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        await task.deleteOne();

        // Real-time Update for Project Board
        const io = req.app.get('io');
        if (io) {
            io.to(task.project.toString()).emit('task_deleted', req.params.id);
        }

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getProjectTasks,
    updateTask,
    deleteTask,
};
