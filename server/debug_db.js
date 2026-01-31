const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const User = require('./models/User');

dotenv.config();

const debugTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const tasks = await Task.find({}).populate('assignee', 'name email');
        const users = await User.find({});

        const output = {
            taskCount: tasks.length,
            tasks: tasks.map(t => ({
                id: t._id,
                name: t.name,
                status: t.status,
                assigneeId: t.assignee ? t.assignee._id : 'Unassigned',
                assigneeName: t.assignee ? t.assignee.name : 'N/A'
            })),
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email
            }))
        };

        fs.writeFileSync('debug_results.json', JSON.stringify(output, null, 2));
        console.log('Results written to debug_results.json');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugTasks();
