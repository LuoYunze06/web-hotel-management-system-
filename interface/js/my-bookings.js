document.addEventListener('DOMContentLoaded', function() {
    chkLogin();
});

function chkLogin() {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    const guestName = localStorage.getItem('guestName');

    if (isLoggedIn && guestName) {
        document.getElementById('guestInfo').textContent = `Welcome, ${guestName}`;
        document.getElementById('guestInfo').style.display = 'inline';
        document.getElementById('logoutLink').style.display = 'inline';
        document.getElementById('content').style.display = 'block';
        loadBks();
    } else {
        document.getElementById('loginModal').classList.add('show');
    }
}

function loadBks() {
    loadRoomBk();
    loadFoodBk();

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
}

function loadRoomBk() {
    const bookings = JSON.parse(localStorage.getItem('roomBookings') || '[]');
    const container = document.getElementById('roomBookingsList');

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏨</div>
                <p>No room booking records</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map((booking, index) => `
        <div class="booking-card">
            <h3>Room Booking #${index + 1}</h3>
            <div class="booking-info">
                <div class="booking-info-item">
                    <label>Room Type:</label>
                    <value>${booking.roomTypeName}</value>
                </div>
                <div class="booking-info-item">
                    <label>Check-in:</label>
                    <value>${booking.checkIn}</value>
                </div>
                <div class="booking-info-item">
                    <label>Check-out:</label>
                    <value>${booking.checkOut}</value>
                </div>
                <div class="booking-info-item">
                    <label>Guests:</label>
                    <value>${booking.adults} adults, ${booking.children} children</value>
                </div>
                <div class="booking-info-item">
                    <label>Phone:</label>
                    <value>${booking.phone}</value>
                </div>
                <div class="booking-info-item">
                    <label>Total:</label>
                    <value style="color: var(--primary);">¥${booking.totalPrice}</value>
                </div>
            </div>
            ${booking.remark ? `<div class="booking-remark">Remarks: ${booking.remark}</div>` : ''}
        </div>
    `).join('');
}

function loadFoodBk() {
    const bookings = JSON.parse(localStorage.getItem('foodBookings') || '[]');
    const container = document.getElementById('foodBookingsList');

    const tableNames = {
        small: 'Small Table',
        medium: 'Medium Table',
        large: 'Large Table',
        vip: 'VIP Room'
    };

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>No dining booking records</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map((booking, index) => `
        <div class="booking-card">
            <h3>Dining Booking #${index + 1}</h3>
            <div class="booking-info">
                <div class="booking-info-item">
                    <label>Guests:</label>
                    <value>${booking.people} people</value>
                </div>
                <div class="booking-info-item">
                    <label>Date:</label>
                    <value>${booking.date}</value>
                </div>
                <div class="booking-info-item">
                    <label>Time:</label>
                    <value>${booking.time}</value>
                </div>
                <div class="booking-info-item">
                    <label>Table:</label>
                    <value>${tableNames[booking.table] || booking.table}</value>
                </div>
                <div class="booking-info-item">
                    <label>Phone:</label>
                    <value>${booking.phone}</value>
                </div>
            </div>
            ${booking.remark ? `<div class="booking-remark">Remarks: ${booking.remark}</div>` : ''}
        </div>
    `).join('');
}

function guestOut() {
    localStorage.removeItem('guestLoggedIn');
    localStorage.removeItem('guestName');
    window.location.href = 'before.html';
}

function goLogin() {
    window.location.href = 'guest-login.html';
}

function goBack() {
    window.location.href = 'before.html';
}
