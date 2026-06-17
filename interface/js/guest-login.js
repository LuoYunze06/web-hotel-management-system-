const defaultAdminUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'manager', password: 'manager123' }
];

function readList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function findByCredentials(list, username, password) {
    return list.find(item => item.username === username && item.password === password);
}

document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }

            loginMessage.className = 'message';
            registerMessage.className = 'message';
        });
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        const admin = findByCredentials(defaultAdminUsers.concat(readList('users')), username, password);
        if (admin) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminName', admin.username);
            localStorage.setItem('hotelUsername', admin.username);
            loginMessage.textContent = 'Admin login successful. Opening admin console...';
            loginMessage.className = 'message success';

            setTimeout(() => {
                window.location.href = 'behind.html';
            }, 800);
            return;
        }

        const guest = findByCredentials(readList('guests'), username, password);
        if (guest) {
            localStorage.setItem('guestLoggedIn', 'true');
            localStorage.setItem('guestName', guest.username);
            loginMessage.textContent = 'Login successful. Opening guest portal...';
            loginMessage.className = 'message success';

            setTimeout(() => {
                window.location.href = 'before.html';
            }, 800);
        } else {
            loginMessage.textContent = 'Invalid username or password.';
            loginMessage.className = 'message error';
        }
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            registerMessage.textContent = 'Passwords do not match.';
            registerMessage.className = 'message error';
            return;
        }

        const guests = readList('guests');
        const adminExists = defaultAdminUsers.concat(readList('users')).some(user => user.username === username);
        const existingGuest = guests.find(guest => guest.username === username);

        if (existingGuest || adminExists) {
            registerMessage.textContent = 'This username is already registered.';
            registerMessage.className = 'message error';
            return;
        }

        const newGuest = {
            username: username,
            phone: phone,
            password: password,
            registerTime: new Date().toISOString()
        };

        guests.push(newGuest);
        localStorage.setItem('guests', JSON.stringify(guests));

        registerMessage.textContent = 'Registration successful. Please log in.';
        registerMessage.className = 'message success';

        setTimeout(() => {
            tabBtns[0].click();
            document.getElementById('loginUsername').value = username;
        }, 800);
    });
});
