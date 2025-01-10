// Hardcoded admin credentials
const adminCredentials = {
    id: 'vicinityStart',
    password: 'passwordStart'
};

// Show the login modal when the button is clicked
document.getElementById('adminLoginBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('adminLoginModal')).show();
});

// Handle admin login form submission
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const adminId = document.getElementById('adminId').value.trim();
    const adminPassword = document.getElementById('adminPassword').value.trim();

    // Check credentials
    if (adminId === adminCredentials.id && adminPassword === adminCredentials.password) {
        alert('Login successful!');
        window.location.href = '/listings/adminDashboard'; // Redirect to admin dashboard
    } else {
        alert('Invalid login ID or password');
    }
});
