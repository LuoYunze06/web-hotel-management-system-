function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.registerTime}</td>
            <td><button class="btn delete-btn" onclick="delUser(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="empty-message">No users</td>';
        tbody.appendChild(row);
    }
}

function delUser(index) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

function clearUsers() {
    if (confirm('Clear all users?')) {
        localStorage.removeItem('users');
        loadUsers();
    }
}

function showMsg(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = 'message ' + type;
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showMsg('Passwords do not match.', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.username === username);

    if (existingUser || ['admin', 'manager'].includes(username)) {
        showMsg('This username already exists.', 'error');
        return;
    }

    users.push({
        username: username,
        password: password,
        registerTime: new Date().toLocaleString('en-US')
    });

    saveUsers(users);
    showMsg('Registration successful.', 'success');

    document.getElementById('registerForm').reset();
    loadUsers();
});

loadUsers();
