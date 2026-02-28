const express = require('express');
const router = express.Router();

// Mock data
const timetables = {};

// Get timetable for user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(timetables[userId] || {});
});

// Create/Update timetable
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { schedule } = req.body;

  if (!schedule) {
    return res.status(400).json({ message: 'Schedule data is required' });
  }

  timetables[userId] = {
    userId,
    schedule,
    updatedAt: new Date()
  };

  res.status(201).json(timetables[userId]);
});

// Add event to timetable
router.post('/:userId/events', (req, res) => {
  const { userId } = req.params;
  const { day, startTime, endTime, title, description } = req.body;

  if (!timetables[userId]) {
    timetables[userId] = { userId, schedule: {} };
  }

  if (!timetables[userId].schedule[day]) {
    timetables[userId].schedule[day] = [];
  }

  const event = {
    id: Date.now(),
    startTime,
    endTime,
    title,
    description,
    createdAt: new Date()
  };

  timetables[userId].schedule[day].push(event);
  res.status(201).json(event);
});

// Update event
router.put('/:userId/events/:eventId', (req, res) => {
  const { userId, eventId } = req.params;
  const { day, startTime, endTime, title, description } = req.body;

  if (!timetables[userId]) {
    return res.status(404).json({ message: 'Timetable not found' });
  }

  for (let dayKey in timetables[userId].schedule) {
    const event = timetables[userId].schedule[dayKey].find(e => e.id == eventId);
    if (event) {
      if (startTime) event.startTime = startTime;
      if (endTime) event.endTime = endTime;
      if (title) event.title = title;
      if (description) event.description = description;
      return res.json(event);
    }
  }

  res.status(404).json({ message: 'Event not found' });
});

// Delete event
router.delete('/:userId/events/:eventId', (req, res) => {
  const { userId, eventId } = req.params;

  if (!timetables[userId]) {
    return res.status(404).json({ message: 'Timetable not found' });
  }

  for (let dayKey in timetables[userId].schedule) {
    timetables[userId].schedule[dayKey] = timetables[userId].schedule[dayKey].filter(e => e.id != eventId);
  }

  res.json({ message: 'Event deleted' });
});

module.exports = router;
