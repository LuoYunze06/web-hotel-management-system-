const defaultAdminUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'manager', password: 'manager123' }
];

document.addEventListener('DOMContentLoaded', function () {
    setupLogin();
    setupUserName();
    setupSearch();
    setupButtons();
});

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

function setupLogin() {
    var form = document.querySelector('form[action="dashboard.html"]');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var usernameInput = form.querySelector('input[name="username"]');
        var passwordInput = form.querySelector('input[name="password"]');
        var username = usernameInput ? usernameInput.value.trim() : '';
        var password = passwordInput ? passwordInput.value : '';
        var message = document.getElementById('loginMessage');
        var user = getAdminUsers().find(function (item) {
            return item.username === username && item.password === password;
        });

        if (!user) {
            if (message) {
                message.textContent = 'Invalid username or password.';
                message.className = 'message error';
            } else {
                alert('Invalid username or password.');
            }
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminName', user.username);
        localStorage.setItem('hotelUsername', user.username);
        window.location.href = form.getAttribute('action');
    });
}

function setupUserName() {
    var userName = localStorage.getItem('hotelUsername') || localStorage.getItem('adminName') || 'Admin';
    var userText = document.querySelector('.user span');

    if (userText) {
        userText.textContent = 'Welcome, ' + userName;
    }
}

function setupSearch() {
    document.querySelectorAll('.search').forEach(function (searchBox) {
        var input = searchBox.querySelector('input');
        var button = searchBox.querySelector('button');

        if (!input || !button) return;

        button.addEventListener('click', function () {
            filterContent(searchBox, input.value);
        });

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                filterContent(searchBox, input.value);
            }
        });
    });
}

function filterContent(searchBox, keyword) {
    var box = searchBox.closest('.box') || document;
    var query = keyword.trim().toLowerCase();
    var tableRows = box.querySelectorAll('.table tbody tr');
    var supplierCards = box.querySelectorAll('.sup-card');

    tableRows.forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });

    supplierCards.forEach(function (card) {
        card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}

function setupButtons() {
    document.querySelectorAll('button').forEach(function (button) {
        if (button.closest('.search') || (button.closest('form') && button.type === 'submit')) return;

        button.addEventListener('click', function () {
            var text = button.textContent.trim();

            if (text === 'Delete') {
                deleteRow(button);
                return;
            }

            if (text === 'Stock In' || text === 'Stock Out') {
                updateStock(button, text);
                return;
            }

            alert(text + ' demo action');
        });
    });
}

function deleteRow(button) {
    var row = button.closest('tr');

    if (row && confirm('Delete this record?')) {
        row.remove();
    }
}

function updateStock(button, action) {
    var row = button.closest('tr');
    if (!row || row.cells.length < 7) return;

    var stockCell = row.cells[3];
    var safeCell = row.cells[5];
    var statusCell = row.cells[6];
    var stock = parseInt(stockCell.textContent, 10);
    var safeStock = parseInt(safeCell.textContent, 10);

    if (Number.isNaN(stock) || Number.isNaN(safeStock)) return;

    stock = action === 'Stock In' ? stock + 10 : Math.max(0, stock - 10);
    stockCell.textContent = stock;

    if (stock < safeStock) {
        statusCell.innerHTML = '<span class="tag tag-red">Low</span>';
    } else {
        statusCell.innerHTML = '<span class="tag tag-green">Normal</span>';
    }
}
