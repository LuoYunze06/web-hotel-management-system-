document.addEventListener('DOMContentLoaded', function() {
    chkLogin();
});

function chkLogin() {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('bookingContent').style.display = 'block';
        initForm();
    } else {
        document.getElementById('loginModal').classList.add('show');
    }
}

function goLogin() {
    window.location.href = 'guest-login.html';
}

function goBack() {
    window.location.href = 'before.html';
}

function initForm() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            people: formData.get('people'),
            date: formData.get('date'),
            time: formData.get('time'),
            table: formData.get('table'),
            remark: formData.get('remark'),
            bookingTime: new Date().toISOString()
        };
        
        const bookings = JSON.parse(localStorage.getItem('foodBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('foodBookings', JSON.stringify(bookings));
        
        form.reset();
        modal.classList.add('show');
    });
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    window.location.href = 'before.html';
}

function chkLog(e) {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    if (!isLoggedIn) {
        e.preventDefault();
        document.getElementById('loginModal').classList.add('show');
        return false;
    }
    return true;
}