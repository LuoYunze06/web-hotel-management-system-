const defaultGuestList = [
    { id: 'GUS001', name: 'Alice Johnson', room: '101', phone: '555-0101', date: '2026-06-01' },
    { id: 'GUS002', name: 'Michael Brown', room: '208', phone: '555-0208', date: '2026-06-01' },
    { id: 'GUS003', name: 'Sophia Davis', room: '315', phone: '555-0315', date: '2026-06-02' }
];

let guestList = loadGuestList();

function loadGuestList() {
    const savedGuests = JSON.parse(localStorage.getItem('guestList')) || [];
    return Array.isArray(savedGuests) && savedGuests.length > 0 ? savedGuests : defaultGuestList;
}

function saveGuests() {
    localStorage.setItem('guestList', JSON.stringify(guestList));
}

function getToday() {
    return new Date().toISOString().slice(0, 10);
}

function renderGuests() {
    const tbody = document.getElementById('guestBody');
    tbody.innerHTML = '';

    guestList.forEach(guest => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${guest.id}</td>
            <td>${guest.name}</td>
            <td>${guest.room}</td>
            <td>${guest.phone || '-'}</td>
            <td>${guest.date || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function addGuest() {
    const nameInput = document.getElementById('gname');
    const roomInput = document.getElementById('groom');
    const phoneInput = document.getElementById('gphone');
    const dateInput = document.getElementById('gdate');

    const name = nameInput.value.trim();
    const room = roomInput.value.trim();
    const phone = phoneInput.value.trim();
    const date = dateInput.value || getToday();

    if (!name || !room || !date) {
        alert('Please complete the guest information.');
        return;
    }

    const id = `GUS${String(guestList.length + 1).padStart(3, '0')}`;
    guestList.push({ id, name, room, phone, date });

    saveGuests();
    renderGuests();

    nameInput.value = '';
    roomInput.value = '';
    phoneInput.value = '';
    dateInput.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    saveGuests();
    renderGuests();
});
