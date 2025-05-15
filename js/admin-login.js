document.getElementById('admin-login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Hardcoded admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'password123';

    if (username === adminUsername && password === adminPassword) {
        // Store login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', 'admin');

        alert('Login successful!');
        window.location.href = 'admin.html'; // Redirect to admin dashboard
    } else {
        alert('Invalid username or password.');
    }
});
