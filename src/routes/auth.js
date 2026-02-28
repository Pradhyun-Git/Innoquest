const express = require('express');
const router = express.Router();

// Mock user data (in production, use database)
const users = {};

// Register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (users[email]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users[email] = { email, password, name, createdAt: new Date() };
  res.status(201).json({ message: 'User registered successfully', user: { email, name } });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
});

// Google login (simulated)
router.post('/google-login', (req, res) => {
  const { email, name } = req.body;

  if (!users[email]) {
    users[email] = { email, name, createdAt: new Date(), googleAuth: true };
  }

  res.json({ message: 'Google login successful', user: { email, name } });
});

module.exports = router;
