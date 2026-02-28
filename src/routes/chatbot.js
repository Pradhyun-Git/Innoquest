const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock chatbot responses (can be replaced with actual API)
const getChatbotResponse = async (message, userId) => {
  try {
    // Using a mock response for now - replace with actual API call
    // Example: OpenAI API, Hugging Face, etc.
    
    const responses = {
      'hello': 'Hello! I\'m your AI assistant. I can help you with your tasks and timetable. What would you like to do?',
      'help': 'I can help you with: creating tasks, managing your timetable, organizing your schedule, and providing productivity tips.',
      'task': 'I can help you create a new task. Tell me the task name and due date, and I\'ll add it for you!',
      'timetable': 'I can help you build your timetable. What time would you like to schedule activities?',
    };

    const lowerMessage = message.toLowerCase();
    let response = 'I\'m here to help! Ask me about tasks, timetable, or productivity tips.';

    for (let key in responses) {
      if (lowerMessage.includes(key)) {
        response = responses[key];
        break;
      }
    }

    return { message: response, timestamp: new Date() };
  } catch (error) {
    return { message: 'Sorry, I encountered an error. Please try again.', error: error.message };
  }
};

// Chat endpoint
router.post('/:userId/chat', async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const botResponse = await getChatbotResponse(message, userId);
    res.json(botResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error processing message', error: error.message });
  }
});

// Suggest tasks based on user input
router.post('/:userId/suggest-tasks', async (req, res) => {
  const { userId } = req.params;
  const { input } = req.body;

  const suggestions = [
    { title: 'Review notes', priority: 'high', dueDate: 'today' },
    { title: 'Exercise', priority: 'medium', dueDate: 'today' },
    { title: 'Prepare for meeting', priority: 'high', dueDate: 'tomorrow' },
    { title: 'Read a book', priority: 'low', dueDate: 'this week' },
  ];

  res.json({ suggestions: suggestions.slice(0, 3) });
});

// Optimize timetable
router.post('/:userId/optimize-schedule', async (req, res) => {
  const { userId } = req.params;
  const { schedule } = req.body;

  const optimizedSchedule = {
    message: 'Your schedule has been optimized for maximum productivity!',
    suggestions: [
      'Group similar tasks together',
      'Take breaks every 90 minutes',
      'Schedule important tasks during peak hours',
      'Leave buffer time between meetings'
    ],
    schedule: schedule
  };

  res.json(optimizedSchedule);
});

module.exports = router;
