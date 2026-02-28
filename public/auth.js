// Auth Functions
function showLoginModal() {
  document.getElementById('loginModal').classList.add('active');
  document.getElementById('registerModal').classList.remove('active');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

function showRegisterModal() {
  document.getElementById('registerModal').classList.add('active');
  document.getElementById('loginModal').classList.remove('active');
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('active');
}

function switchToRegister() {
  closeLoginModal();
  showRegisterModal();
}

function switchToLogin() {
  closeRegisterModal();
  showLoginModal();
}

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/dashboard';
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Handle Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/dashboard';
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Google Login/Signup (Simulated)
function googleLogin() {
  // In production, this would use Firebase Google Auth
  const email = `user_${Date.now()}@gmail.com`;
  const name = 'Google User';

  fetch('/api/auth/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/dashboard';
  })
  .catch(error => alert('Google login failed: ' + error.message));
}

function googleSignup() {
  googleLogin();
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  if (event.target === loginModal) {
    closeLoginModal();
  }
  if (event.target === registerModal) {
    closeRegisterModal();
  }
});
