const express = require('express');
const router = express.Router();

// Mock data
const tasks = {};

// Get all tasks for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(tasks[userId] || []);
});

// Create a new task
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { title, description, dueDate, priority } = req.body;

  if (!tasks[userId]) {
    tasks[userId] = [];
  }

  const newTask = {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority: priority || 'medium',
    completed: false,
    createdAt: new Date()
  };

  tasks[userId].push(newTask);
  res.status(201).json(newTask);
});

// Update task
router.put('/:userId/:taskId', (req, res) => {
  const { userId, taskId } = req.params;
  const { title, description, dueDate, priority, completed } = req.body;

  if (!tasks[userId]) {
    return res.status(404).json({ message: 'No tasks found' });
  }

  const task = tasks[userId].find(t => t.id == taskId);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (dueDate) task.dueDate = dueDate;
  if (priority) task.priority = priority;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Delete task
router.delete('/:userId/:taskId', (req, res) => {
  const { userId, taskId } = req.params;

  if (!tasks[userId]) {
    return res.status(404).json({ message: 'No tasks found' });
  }

  tasks[userId] = tasks[userId].filter(t => t.id != taskId);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
