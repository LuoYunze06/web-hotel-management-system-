function init() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    } else {
        window.location.href = 'guest-login.html';
    }
}

function showDashboard() {
    document.getElementById('dashboardView').style.display = 'block';

    const adminName = localStorage.getItem('adminName') || 'Admin';
    const userName = document.querySelector('.user-info span');
    const avatar = document.querySelector('.user-avatar');
    if (userName) userName.textContent = adminName;
    if (avatar) avatar.textContent = adminName.charAt(0).toUpperCase();
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminName');
    localStorage.removeItem('hotelUsername');
    window.location.href = 'guest-login.html';
}

function navigateTo(url) {
    window.location.href = url;
}

init();
