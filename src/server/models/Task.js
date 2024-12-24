const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    user: { type: String, required: true }, // Hardcoded 'admin' for now
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;


