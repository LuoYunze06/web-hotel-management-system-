const roomStatusLabels = {
    Reserved: 'Reserved',
    Occupied: 'Occupied',
    CheckedOut: 'Checked Out'
};

const roomTypeLabels = {
    Standard: 'Double Room',
    Deluxe: 'Deluxe Suite',
    Suite: 'Deluxe Suite',
    Single: 'Single Room',
    Double: 'Double Room',
    Family: 'Family Room',
    'Standard Room': 'Double Room',
    'Deluxe Room': 'Deluxe Suite',
    'Deluxe Suite': 'Deluxe Suite'
};

const ROOM_STATUS_KEY = 'roomStatusList';
const validRoomStatuses = ['Reserved', 'Occupied', 'CheckedOut'];

function createDefaultRooms() {
    const roomTypes = ['Single', 'Double', 'Family', 'Deluxe'];
    const rooms = [];

    for (let floor = 1; floor <= 4; floor++) {
        for (let index = 1; index <= roomTypes.length; index++) {
            const no = floor * 100 + index;
            rooms.push({
                no,
                floor,
                type: roomTypes[index - 1],
                guest: '-',
                status: 'CheckedOut'
            });
        }
    }

    return rooms;
}

function normalizeRooms(savedRooms) {
    const defaults = createDefaultRooms();

    if (!Array.isArray(savedRooms)) {
        return defaults;
    }

    return defaults.map(defaultRoom => {
        const savedRoom = savedRooms.find(item => Number(item.no) === defaultRoom.no);
        return {
            ...defaultRoom,
            ...savedRoom,
            no: defaultRoom.no,
            floor: defaultRoom.floor,
            type: defaultRoom.type,
            guest: '-',
            status: validRoomStatuses.includes(savedRoom && savedRoom.status) ? savedRoom.status : 'CheckedOut'
        };
    });
}

let roomList = normalizeRooms(JSON.parse(localStorage.getItem(ROOM_STATUS_KEY)));
let currentPage = 1;
const roomsPerPage = 5;

window.onload = function() {
    saveRooms();
    renderRoomTable(roomList);
};

function saveRooms() {
    localStorage.setItem(ROOM_STATUS_KEY, JSON.stringify(roomList));
}

function renderRoomTable(rooms) {
    const tbody = document.getElementById('roomStatusBody');
    tbody.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(rooms.length / roomsPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * roomsPerPage;
    const currentRooms = rooms.slice(startIndex, startIndex + roomsPerPage);

    currentRooms.forEach(room => {
        const tr = document.createElement('tr');
        const statusText = roomStatusLabels[room.status] || room.status;
        const roomTypeText = roomTypeLabels[room.type] || room.type;

        tr.innerHTML = `
            <td>${room.no}</td>
            <td>${room.floor}</td>
            <td>${roomTypeText}</td>
            <td><span class="badge badge-${getStatusClass(room.status)}">${statusText}</span></td>
            <td><button onclick="editRoomStatus(${room.no})">Edit</button></td>
        `;
        tbody.appendChild(tr);
    });

    renderPagination(totalPages, rooms.length);
}

function renderPagination(totalPages, totalCount) {
    const pagination = document.getElementById('roomPagination');

    if (!pagination) {
        return;
    }

    pagination.innerHTML = '';

    const info = document.createElement('span');
    info.textContent = `${totalCount} rooms, page ${currentPage} / ${totalPages}`;
    pagination.appendChild(info);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.textContent = page;
        button.className = page === currentPage ? 'active-page' : '';
        button.onclick = function() {
            currentPage = page;
            renderRoomTable(roomList);
        };
        pagination.appendChild(button);
    }
}

function getStatusClass(status) {
    const classMap = {
        Reserved: 'reserved',
        Occupied: 'occupied',
        CheckedOut: 'done'
    };
    return classMap[status] || 'done';
}

function editRoomStatus(roomNo) {
    const room = roomList.find(item => Number(item.no) === Number(roomNo));

    if (!room) {
        alert('Room not found.');
        return;
    }

    openRoomStatusModal(room);
}

function openRoomStatusModal(room) {
    let backdrop = document.getElementById('roomStatusModal');

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'roomStatusModal';
        backdrop.className = 'app-modal-backdrop';
        backdrop.innerHTML = `
            <div class="app-modal" role="dialog" aria-modal="true" aria-labelledby="roomStatusModalTitle">
                <h3 id="roomStatusModalTitle">Edit Room Status</h3>
                <div class="form-group">
                    <label for="roomStatusSelect">Status</label>
                    <select id="roomStatusSelect">
                        <option value="Reserved">Reserved</option>
                        <option value="Occupied">Occupied</option>
                        <option value="CheckedOut">Checked Out</option>
                    </select>
                </div>
                <div class="app-modal-actions">
                    <button type="button" class="btn-secondary" id="cancelRoomStatus">Cancel</button>
                    <button type="button" id="saveRoomStatus">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
    }

    const select = document.getElementById('roomStatusSelect');
    const saveButton = document.getElementById('saveRoomStatus');
    const cancelButton = document.getElementById('cancelRoomStatus');

    select.value = room.status;
    backdrop.classList.add('show');
    select.focus();

    function closeModal() {
        backdrop.classList.remove('show');
    }

    saveButton.onclick = function() {
        updateRoomStatus(room.no, select.value);
        closeModal();
    };

    cancelButton.onclick = closeModal;
    backdrop.onclick = function(event) {
        if (event.target === backdrop) {
            closeModal();
        }
    };
}

function updateRoomStatus(roomNo, newStatus) {
    const room = roomList.find(item => Number(item.no) === Number(roomNo));

    if (!room) {
        alert('Room not found.');
        return;
    }

    room.status = newStatus;
    room.guest = '-';
    saveRooms();
    renderRoomTable(roomList);
}
