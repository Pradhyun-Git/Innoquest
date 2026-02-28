# Innoquest - Get Organized

A modern web application designed to help you stay organized and productive. Manage your tasks, create timetables, and get personalized assistance from an AI chatbot.

## Features

✨ **Smart Task Manager**
- Create, edit, and delete tasks
- Set priorities (Low, Medium, High)
- Track task completion
- Filter tasks by status (Today, This Week, Completed)

📅 **Weekly Timetable**
- Schedule events for each day of the week
- Organize your time efficiently
- Keep track of daily activities
- Visual weekly calendar view

🤖 **AI Assistant Chatbot**
- Get personalized task suggestions
- Optimize your daily schedule
- Receive productivity tips
- Natural language chat interface

🔐 **Secure Authentication**
- Email & Password login
- Google Sign-In integration (ready to configure)
- Persistent user sessions
- Secure data storage

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (Modern responsive design)
- Vanilla JavaScript
- No external UI framework dependencies

**Backend:**
- Node.js
- Express.js
- CORS enabled
- RESTful API architecture

**Database/Auth:**
- In-memory storage (can be replaced with MongoDB, Firebase, etc.)
- JWT ready architecture

## Project Structure

```
Innoquest/
├── public/
│   ├── index.html          # Landing page
│   ├── dashboard.html      # Main dashboard
│   ├── styles.css          # Global styles
│   ├── dashboard.css       # Dashboard specific styles
│   ├── auth.js             # Authentication logic
│   └── dashboard.js        # Dashboard functionality
├── src/
│   └── routes/
│       ├── auth.js         # Authentication endpoints
│       ├── tasks.js        # Task management endpoints
│       ├── timetable.js    # Timetable endpoints
│       └── chatbot.js      # Chatbot endpoints
├── package.json
├── server.js               # Express server setup
└── .env.example           # Environment variables template
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Clone or Download
```bash
cd "c:\Users\pradh\OneDrive\Documents\GitHub\Innoquest"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
```

Note: For now, the app uses in-memory storage. To use Firebase or another database, update the `.env` file with appropriate credentials.

### Step 4: Start the Server
```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Or production mode
npm start
```

The application will be available at `http://localhost:5000`

## Usage Guide

### 1. Getting Started
- Visit the landing page and click "Sign Up"
- Create an account with email/password or use Google Sign-In
- You'll be redirected to your personalized dashboard

### 2. Managing Tasks
- Click on "Tasks" in the sidebar
- Click "+ New Task" to create a task
- Set title, description, due date, and priority
- Mark tasks as complete with the checkbox
- Use filters to view tasks by status

### 3. Creating a Timetable
- Go to the "Timetable" section
- Click "+ New Event" to add an activity
- Select the day, time, and add event details
- Your weekly schedule will be displayed in a grid format
- View today's events on the dashboard overview

### 4. Using AI Assistant
- Click on "AI Assistant" (🤖) in the sidebar
- Type your message or click suggestion buttons
- Get personalized recommendations for tasks and schedules
- The bot can suggest tasks and help optimize your day

### 5. Dashboard Overview
- See statistics: Total tasks, completed, in progress, and today's tasks
- Quick view of upcoming tasks
- Today's schedule at a glance

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-login` - Google authentication

### Tasks
- `GET /api/tasks/:userId` - Get all tasks
- `POST /api/tasks/:userId` - Create task
- `PUT /api/tasks/:userId/:taskId` - Update task
- `DELETE /api/tasks/:userId/:taskId` - Delete task

### Timetable
- `GET /api/timetable/:userId` - Get timetable
- `POST /api/timetable/:userId` - Create/update timetable
- `POST /api/timetable/:userId/events` - Add event
- `PUT /api/timetable/:userId/events/:eventId` - Update event
- `DELETE /api/timetable/:userId/events/:eventId` - Delete event

### Chatbot
- `POST /api/chatbot/:userId/chat` - Send message to chatbot
- `POST /api/chatbot/:userId/suggest-tasks` - Get task suggestions
- `POST /api/chatbot/:userId/optimize-schedule` - Optimize schedule

## Customization

### Change Colors
Edit the CSS variables in `public/styles.css`:
```css
:root {
  --primary-color: #6366f1;  /* Main blue */
  --secondary-color: #8b5cf6; /* Purple accent */
  --success-color: #10b981;   /* Green */
  /* ... more colors */
}
```

### Integrate with Firebase
1. Create a Firebase project
2. Get your Firebase credentials
3. Update `.env` file with Firebase config
4. Replace the mock authentication with Firebase SDK

### Enhance Chatbot
Currently uses basic rule-based responses. For AI-powered suggestions:
- Integrate OpenAI API for ChatGPT responses
- Use Hugging Face API for NLP
- Connect to your own ML model

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- [ ] Database integration (MongoDB/Firebase)
- [ ] Advanced AI chatbot with NLP
- [ ] Mobile app version
- [ ] Dark mode theme
- [ ] Recurring tasks & events
- [ ] Task reminders & notifications
- [ ] Team collaboration features
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Calendar view for timetable

## Troubleshooting

**Port 5000 already in use:**
```bash
# Change port in .env
PORT=5001
```

**Tasks not persisting:**
The app currently uses in-memory storage. Data resets on server restart. Implement database integration for persistence.

**Chatbot not responding:**
Check that the API key is set correctly in `.env` and the chatbot route is accessible.

## Contributing
Feel free to fork, modify, and improve the application!

## License
MIT License - feel free to use this project for personal or commercial purposes.

## Support
For issues or questions, refer to the documentation or create an issue in your repository.

---

**Built with ❤️ to help you stay organized and productive!**

Version: 1.0.0  
Last Updated: February 2026