// Check if user is logged in
const session = JSON.parse(localStorage.getItem('cvms_session') || 'null');

if (!session) {
    window.location.href = 'login.html';
} else {
    const welcomeMessage = document.getElementById('welcome-message');
    const dashboardContent = document.getElementById('dashboard-content');

    welcomeMessage.textContent = `Welcome to CVMS Dashboard, ${session.user} (${session.role})`;

    // Role-based content
    let content = '';

    if (session.role === 'admin') {
        content = `
            <div class="dashboard-cards">
                <div class="feature-card">
                    <h3>👥 Admin Panel</h3>
                    <p>Manage hospitals, view all data, approve appointments.</p>
                    <button class="cta-button">Manage Hospitals</button>
                </div>
                <div class="feature-card">
                    <h3>👶 All Children</h3>
                    <p>View and manage all child records across the system.</p>
                    <button class="cta-button">View Children</button>
                </div>
                <div class="feature-card">
                    <h3>📊 Reports</h3>
                    <p>Generate comprehensive reports and analytics.</p>
                    <button class="cta-button">Generate Reports</button>
                </div>
            </div>
        `;
    } else if (session.role === 'hospital') {
        content = `
            <div class="dashboard-cards">
                <div class="feature-card">
                    <h3>📅 Appointments</h3>
                    <p>View and update appointment statuses.</p>
                    <button class="cta-button">Manage Appointments</button>
                </div>
                <div class="feature-card">
                    <h3>💉 Vaccinations</h3>
                    <p>Record completed vaccinations.</p>
                    <button class="cta-button">Update Records</button>
                </div>
                <div class="feature-card">
                    <h3>📋 Schedule</h3>
                    <p>View today's vaccination schedule.</p>
                    <button class="cta-button">View Schedule</button>
                </div>
            </div>
        `;
    } else if (session.role === 'parent') {
        content = `
            <div class="dashboard-cards">
                <div class="feature-card">
                    <h3>👶 My Children</h3>
                    <p>Manage your children's profiles and vaccination records.</p>
                    <button class="cta-button">View Children</button>
                </div>
                <div class="feature-card">
                    <h3>📅 Book Appointment</h3>
                    <p>Schedule vaccination appointments.</p>
                    <button class="cta-button">Book Now</button>
                </div>
                <div class="feature-card">
                    <h3>📜 Certificates</h3>
                    <p>Download vaccination certificates.</p>
                    <button class="cta-button">View Certificates</button>
                </div>
                <div class="feature-card">
                    <h3>🔔 Reminders</h3>
                    <p>View upcoming vaccination reminders.</p>
                    <button class="cta-button">View Reminders</button>
                </div>
            </div>
        `;
    }

    dashboardContent.innerHTML = content;

    // Add click handlers for buttons (placeholder functionality)
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            alert('This feature is coming soon! This is a demo version using only HTML, CSS, and JavaScript.');
        });
    });
}

// Logout functionality
document.getElementById('logout-link').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('cvms_session');
    window.location.href = 'index.html';
});