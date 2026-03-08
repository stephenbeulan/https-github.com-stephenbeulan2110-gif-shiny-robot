// Login form handling
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showLoginMessage('Please fill in all fields.', 'error');
            return;
        }

        // Simple authentication (demo purposes)
        let user = null;
        let role = null;

        if (email === 'admin@cvms.com' && password === 'admin123') {
            user = 'admin';
            role = 'admin';
        } else if (email === 'hospital@cvms.com' && password === 'hospital123') {
            user = 'hospital';
            role = 'hospital';
        } else if (email === 'parent@cvms.com' && password === 'parent123') {
            user = 'parent';
            role = 'parent';
        } else {
            showLoginMessage('Invalid credentials. Try the demo accounts above.', 'error');
            return;
        }

        // Store user session in localStorage
        const session = {
            user: user,
            role: role,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('cvms_session', JSON.stringify(session));

        showLoginMessage('Login successful! Redirecting...', 'success');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
}

function showLoginMessage(text, type) {
    loginMessage.innerHTML = `<p class="${type}">${text}</p>`;
    setTimeout(() => {
        loginMessage.innerHTML = '';
    }, 5000);
}