document.addEventListener('DOMContentLoaded', function() {
    chk();
    addShortcuts();
});

function chk() {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    const guestName = localStorage.getItem('guestName');
    const guestInfo = document.getElementById('guestInfo');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const myBookingsLink = document.getElementById('myBookingsLink');

    if (isLoggedIn && guestName) {
        guestInfo.textContent = `Welcome, ${guestName}`;
        guestInfo.style.display = 'inline';
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        myBookingsLink.style.display = 'inline';
    } else {
        guestInfo.style.display = 'none';
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        myBookingsLink.style.display = 'none';
    }
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

function out() {
    localStorage.removeItem('guestLoggedIn');
    localStorage.removeItem('guestName');
    chk();
}

function goLog() {
    window.location.href = 'guest-login.html';
}

function clsLog() {
    document.getElementById('loginModal').classList.remove('show');
}

function addShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            goLog();
        }
    });
}
