const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a project name'],
        },
        description: {
            type: String,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        category: {
            type: String,
        },
        tags: [String],
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
        startDate: Date,
        endDate: Date,
        visibility: {
            type: String,
            enum: ['public', 'private'],
            default: 'public', // visible to all workspace members
        },
        githubRepoOwner: {
            type: String,
        },
        githubRepoName: {
            type: String,
        },
        githubLinkedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
