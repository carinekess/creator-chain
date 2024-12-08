// this is javascript that working on Author's side but if any one have something 
//to change is available you can change @carine @alice @mugisha @gihozo

// Check if user is accessing index.html or other pages directly
if (window.location.pathname.endsWith('index.html') || 
    window.location.pathname.endsWith('/') || 
    window.location.pathname.includes('gallery.html') || 
    window.location.pathname.includes('dashboard.html')) {
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // If not logged in, redirect to welcome page
        window.location.href = 'welcome.html';
    }
}

// Authentication functions

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you would typically make an API call to verify credentials
    // For now, we'll simulate a successful login
    
    // Show success message
    showMessage('Login successful! Redirecting to dashboard...', 'success');
    
    // Store user info in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    // Redirect after showing message
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function signup(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }

    // Here you would typically make an API call to create account
    // For now, we'll simulate a successful signup
    
    // Show success message
    showMessage('Sign up successful! Please log in to continue.', 'success');
    
    // Redirect to login page after showing message
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        const container = document.createElement('div');
        container.id = 'message-container';
        document.body.appendChild(container);
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Remove message after delay
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

function logout() {
    // Clear user session
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Show logout message
    showMessage('Logged out successfully!', 'success');
    
    // Redirect to welcome page
    setTimeout(() => {
        window.location.href = 'welcome.html';
    }, 1500);
}

// Add message container styles
const style = document.createElement('style');
style.textContent = `
    #message-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .message {
        padding: 1rem 2rem;
        margin-bottom: 10px;
        border-radius: 5px;
        color: white;
        animation: slideIn 0.3s ease-out;
    }
    
    .success {
        background: linear-gradient(45deg, #2ecc71, #27ae60);
    }
    
    .error {
        background: linear-gradient(45deg, #e74c3c, #c0392b);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Add event listeners if elements exist
document.getElementById('loginForm')?.addEventListener('submit', login);
document.getElementById('signupForm')?.addEventListener('submit', signup);
document.getElementById('logoutBtn')?.addEventListener('click', logout);
