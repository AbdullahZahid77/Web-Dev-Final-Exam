const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task'); // Import the Task model

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/final-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes

// User login route (hardcoded credentials)
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials
    const hardcodedUser = { username: 'admin', password: 'admin123' };

    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        return res.status(200).json({ message: 'Login successful' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { name, description, dueDate, user } = req.body;

    if (!name || !description || !dueDate || !user) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const task = new Task({ name, description, dueDate, user });

    task.save()
        .then((savedTask) => res.status(201).json(savedTask))
        .catch((err) => res.status(500).json({ message: 'Error creating task', error: err }));
});

// Get all tasks for a user
app.get('/tasks', (req, res) => {
    const user = req.query.user; // Assuming user is passed as a query param
    if (!user) return res.status(400).json({ message: 'User is required' });

    Task.find({ user })
        .then((tasks) => res.json(tasks))
        .catch((err) => res.status(500).json({ message: 'Error fetching tasks', error: err }));
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, dueDate } = req.body;

    Task.findByIdAndUpdate(id, { name, description, dueDate }, { new: true })
        .then((updatedTask) => {
            if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
            res.json(updatedTask);
        })
        .catch((err) => res.status(500).json({ message: 'Error updating task', error: err }));
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    Task.findByIdAndDelete(id)
        .then((deletedTask) => {
            if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task deleted', task: deletedTask });
        })
        .catch((err) => res.status(500).json({ message: 'Error deleting task', error: err }));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
