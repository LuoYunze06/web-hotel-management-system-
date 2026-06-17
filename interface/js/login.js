const defaultAdminUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'manager', password: 'manager123' }
];

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = 'message ' + type;
}

function readList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function getAdminUsers() {
    return defaultAdminUsers.concat(readList('users'));
}

function findByCredentials(list, username, password) {
    return list.find(item => item.username === username && item.password === password);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    const adminUser = findByCredentials(getAdminUsers(), username, password);
    if (adminUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminName', adminUser.username);
        localStorage.setItem('hotelUsername', adminUser.username);
        showMessage('Login successful. Opening admin console...', 'success');
        setTimeout(() => {
            window.location.href = 'behind.html';
        }, 600);
        return;
    }

    const guestUser = findByCredentials(readList('guests'), username, password);
    if (guestUser) {
        localStorage.setItem('guestLoggedIn', 'true');
        localStorage.setItem('guestName', guestUser.username);
        showMessage('Login successful. Opening guest portal...', 'success');
        setTimeout(() => {
            window.location.href = 'before.html';
        }, 600);
        return;
    }

    showMessage('Invalid username or password. Please try again.', 'error');
});
