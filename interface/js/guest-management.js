document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadGuests();
    loadRoomBk();
    loadFoodBks();

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab + 'Tab').classList.add('active');
        });
    });

    document.getElementById('guestSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchGst();
        }
    });
});

function loadStats() {
    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const roomBookings = JSON.parse(localStorage.getItem('roomBookings') || '[]');
    const foodBookings = JSON.parse(localStorage.getItem('foodBookings') || '[]');

    document.getElementById('totalGuests').textContent = guests.length;
    document.getElementById('totalRoomBookings').textContent = roomBookings.length;
    document.getElementById('totalFoodBookings').textContent = foodBookings.length;
}

function loadGuests() {
    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const tbody = document.getElementById('guestsBody');

    if (guests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No guest data</td></tr>';
        return;
    }

    tbody.innerHTML = guests.map(guest => `
        <tr>
            <td>${guest.username}</td>
            <td>${guest.phone}</td>
            <td>${fmtDate(guest.registerTime)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="delGuest('${guest.username}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function loadRoomBk() {
    const bookings = JSON.parse(localStorage.getItem('roomBookings') || '[]');
    const tbody = document.getElementById('roomBookingsBody');

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-message">No room booking data</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${booking.roomTypeName}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>¥${booking.totalPrice}</td>
            <td>${fmtDate(booking.bookingTime)}</td>
        </tr>
    `).join('');
}

function loadFoodBks() {
    const bookings = JSON.parse(localStorage.getItem('foodBookings') || '[]');
    const tbody = document.getElementById('foodBookingsBody');

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-message">No dining booking data</td></tr>';
        return;
    }

    const tableNames = {
        small: 'Small Table',
        medium: 'Medium Table',
        large: 'Large Table',
        vip: 'VIP Room'
    };

    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${booking.people} people</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${tableNames[booking.table] || booking.table}</td>
            <td>${booking.remark || '-'}</td>
            <td>${fmtDate(booking.bookingTime)}</td>
        </tr>
    `).join('');
}

function searchGst() {
    const searchTerm = document.getElementById('guestSearch').value.toLowerCase();
    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const tbody = document.getElementById('guestsBody');

    const filteredGuests = guests.filter(g =>
        g.username.toLowerCase().includes(searchTerm) ||
        g.phone.toLowerCase().includes(searchTerm)
    );

    if (filteredGuests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No matching guests found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredGuests.map(guest => `
        <tr>
            <td>${guest.username}</td>
            <td>${guest.phone}</td>
            <td>${fmtDate(guest.registerTime)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="delGuest('${guest.username}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function delGuest(username) {
    if (!confirm(`Delete guest "${username}"?`)) return;

    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const filteredGuests = guests.filter(g => g.username !== username);
    localStorage.setItem('guests', JSON.stringify(filteredGuests));

    loadGuests();
    loadStats();
}

function fmtDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
