const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'member'],
            default: 'member',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'away'],
            default: 'offline',
        },
        workspaces: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Workspace',
            },
        ],
        refreshToken: {
            type: String,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        githubId: {
            type: String,
        },
        githubAccessToken: {
            type: String,
        },
        githubUsername: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
