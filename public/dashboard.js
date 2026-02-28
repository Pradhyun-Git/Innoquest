// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = '/';
}

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user?.name || 'User';

// State
let tasks = [];
let timetable = {};
let currentFilter = 'all';
let currentTab = 'overview';

// Initialize Dashboard
async function initDashboard() {
  await loadTasks();
  await loadTimetable();
  updateStats();
  displayUpcomingTasks();
  displayTodaySchedule();
}

// Get User ID
function getUserId() {
  return btoa(user.email); // Simple encoding for user ID
}

// ========== TASKS MANAGEMENT ==========

async function loadTasks() {
  try {
    const userId = getUserId();
    const response = await fetch(`/api/tasks/${userId}`);
    tasks = await response.json();
    displayTasks('all');
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

function displayTasks(filter) {
  currentFilter = filter;
  const tasksList = document.getElementById('tasksList');
  
  let filteredTasks = tasks;

  if (filter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    filteredTasks = tasks.filter(t => t.dueDate === today && !t.completed);
  } else if (filter === 'week') {
    const today = new Date();
    const weekFrom = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    filteredTasks = tasks.filter(t => t.dueDate <= weekFrom && !t.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = '<p class="empty-message">No tasks yet. Create your first task!</p>';
    return;
  }

  tasksList.innerHTML = filteredTasks.map(task => `
    <div class="task-item">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
        onchange="toggleTask(${task.id})">
      <div class="task-content">
        <div class="task-title" style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.title}</div>
        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        <div class="task-meta">
          <span class="task-date">📅 ${new Date(task.dueDate).toLocaleDateString()}</span>
          <span class="task-priority priority-${task.priority}">🎯 ${task.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn" onclick="editTask(${task.id})">✏️</button>
        <button class="task-btn" onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

async function createTask(e) {
  e.preventDefault();
  
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('taskDate').value;
  const priority = document.getElementById('taskPriority').value;

  try {
    const userId = getUserId();
    const response = await fetch(`/api/tasks/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, priority })
    });

    if (response.ok) {
      await loadTasks();
      closeTaskModal();
      document.getElementById('taskForm').reset();
      updateStats();
      displayUpcomingTasks();
    }
  } catch (error) {
    alert('Error creating task: ' + error.message);
  }
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const userId = getUserId();
    await fetch(`/api/tasks/${userId}/${taskId}`, { method: 'DELETE' });
    await loadTasks();
    updateStats();
    displayUpcomingTasks();
  } catch (error) {
    alert('Error deleting task: ' + error.message);
  }
}

async function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  try {
    const userId = getUserId();
    await fetch(`/api/tasks/${userId}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    await loadTasks();
    updateStats();
  } catch (error) {
    alert('Error updating task: ' + error.message);
  }
}

function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description || '';
  document.getElementById('taskDate').value = task.dueDate;
  document.getElementById('taskPriority').value = task.priority;

  openTaskModal();
  // TODO: Implement full edit functionality
}

function openTaskModal() {
  document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('active');
}

document.getElementById('taskForm')?.addEventListener('submit', createTask);

// ========== TIMETABLE MANAGEMENT ==========

async function loadTimetable() {
  try {
    const userId = getUserId();
    const response = await fetch(`/api/timetable/${userId}`);
    timetable = await response.json();
    displayTimetable();
  } catch (error) {
    console.error('Error loading timetable:', error);
  }
}

function displayTimetable() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  days.forEach(day => {
    const container = document.getElementById(`schedule-${day}`);
    const events = timetable.schedule?.[day] || [];

    if (events.length === 0) {
      container.innerHTML = '<p class="empty-message">No events</p>';
      return;
    }

    container.innerHTML = events.map(event => `
      <div class="event-item" onclick="editEvent(${event.id})">
        <div class="event-time">${event.startTime} - ${event.endTime}</div>
        <div class="event-name">${event.title}</div>
      </div>
    `).join('');
  });
}

async function createEvent(e) {
  e.preventDefault();

  const title = document.getElementById('eventTitle').value;
  const description = document.getElementById('eventDescription').value;
  const day = document.getElementById('eventDay').value;
  const startTime = document.getElementById('eventStartTime').value;
  const endTime = document.getElementById('eventEndTime').value;

  try {
    const userId = getUserId();
    const response = await fetch(`/api/timetable/${userId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, title, description, startTime, endTime })
    });

    if (response.ok) {
      await loadTimetable();
      closeEventModal();
      document.getElementById('eventForm').reset();
      displayTodaySchedule();
    }
  } catch (error) {
    alert('Error creating event: ' + error.message);
  }
}

function openEventModal() {
  document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
  document.getElementById('eventModal').classList.remove('active');
}

function editEvent(eventId) {
  // TODO: Implement edit functionality
  alert('Edit event functionality coming soon!');
}

function previousWeek() {
  // TODO: Implement week navigation
  alert('Navigate previous week');
}

function nextWeek() {
  // TODO: Implement week navigation
  alert('Navigate next week');
}

document.getElementById('eventForm')?.addEventListener('submit', createEvent);

// ========== STATISTICS ==========

function updateStats() {
  const completedCount = tasks.filter(t => t.completed).length;
  const inProgressCount = tasks.filter(t => !t.completed).length;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = tasks.filter(t => t.dueDate === today).length;

  document.getElementById('totalTasks').textContent = tasks.length;
  document.getElementById('completedTasks').textContent = completedCount;
  document.getElementById('inProgressTasks').textContent = inProgressCount;
  document.getElementById('todayTasks').textContent = todayCount;
}

function displayUpcomingTasks() {
  const upcomingList = document.getElementById('upcomingTasksList');
  const upcoming = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (upcoming.length === 0) {
    upcomingList.innerHTML = '<p class="empty-message">No upcoming tasks</p>';
    return;
  }

  upcomingList.innerHTML = upcoming.map(task => `
    <div class="schedule-item">
      <div class="schedule-time">${new Date(task.dueDate).toLocaleDateString()}</div>
      <div class="schedule-title">${task.title}</div>
    </div>
  `).join('');
}

function displayTodaySchedule() {
  const todaySchedule = document.getElementById('todaySchedule');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const events = timetable.schedule?.[today] || [];

  if (events.length === 0) {
    todaySchedule.innerHTML = '<p class="empty-message">No events scheduled for today</p>';
    return;
  }

  todaySchedule.innerHTML = events.map(event => `
    <div class="schedule-item">
      <div class="schedule-time">${event.startTime} - ${event.endTime}</div>
      <div class="schedule-title">${event.title}</div>
    </div>
  `).join('');
}

// ========== TAB SWITCHING ==========

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');

  // Update page title
  const titles = {
    'overview': 'Dashboard',
    'tasks': 'My Tasks',
    'timetable': 'Weekly Timetable',
    'chatbot': 'AI Assistant'
  };
  document.getElementById('pageTitle').textContent = titles[tabName];

  currentTab = tabName;
}

// ========== CHATBOT ==========

async function sendChat() {
  const input = document.getElementById('chatInput').value.trim();
  if (!input) return;

  sendChatMessage(input);
}

async function sendChatMessage(message) {
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Add user message
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'message user-message';
  userMessageDiv.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(userMessageDiv);

  chatInput.value = '';

  try {
    const userId = getUserId();
    const response = await fetch(`/api/chatbot/${userId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Add bot message
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot-message';
    botMessageDiv.innerHTML = `<p>${data.message}</p>`;
    chatMessages.appendChild(botMessageDiv);

    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
  }
}

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendChat();
  }
}

// ========== LOGOUT ==========

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  }
}

// ========== MODALS CLOSE ==========

window.addEventListener('click', (event) => {
  const taskModal = document.getElementById('taskModal');
  const eventModal = document.getElementById('eventModal');

  if (event.target === taskModal) {
    closeTaskModal();
  }
  if (event.target === eventModal) {
    closeEventModal();
  }
});

// Initialize on page load
window.addEventListener('load', initDashboard);
