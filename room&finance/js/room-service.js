const serviceLabels = {
    Sanitation: 'Cleaning Service',
    Repair: 'Repair',
    Cleaning: 'Cleaning Service',
    'Equipment Repair': 'Repair'
};

const serviceStatusLabels = {
    Pending: 'Pending',
    Done: 'Completed'
};

const defaultServiceList = [
    { id: 'SER001', roomNo: 102, serviceType: 'Sanitation', status: 'Pending', createdAt: '2026-06-01T09:20:00.000Z' },
    { id: 'SER002', roomNo: 205, serviceType: 'Repair', status: 'Pending', createdAt: '2026-06-01T10:15:00.000Z' },
    { id: 'SER003', roomNo: 318, serviceType: 'Sanitation', status: 'Done', createdAt: '2026-05-31T16:40:00.000Z', finishedAt: '2026-05-31T17:10:00.000Z' }
];

let serviceList = normalizeServices(loadServiceList());

function loadServiceList() {
    const savedServices = JSON.parse(localStorage.getItem('serviceList')) || [];
    return Array.isArray(savedServices) && savedServices.length > 0 ? savedServices : defaultServiceList;
}

function normalizeServices(services) {
    return services
        .filter(service =>
            service &&
            service.id &&
            service.roomNo !== undefined &&
            service.serviceType &&
            service.status
        )
        .map(service => ({
            ...service,
            serviceType: normalizeServiceType(service.serviceType),
            status: normalizeServiceStatus(service.status)
        }));
}

function normalizeServiceType(serviceType) {
    if (serviceType === 'Cleaning') {
        return 'Sanitation';
    }

    if (serviceType === 'Equipment Repair') {
        return 'Repair';
    }

    return serviceType;
}

function normalizeServiceStatus(status) {
    return status === 'Completed' ? 'Done' : status;
}

function saveServices() {
    localStorage.setItem('serviceList', JSON.stringify(serviceList));
}

function addService() {
    const roomNo = Number(document.getElementById('serviceRoomNo').value.trim());
    const serviceType = document.getElementById('serviceType').value;

    if (!roomNo) {
        alert('Please enter a room number.');
        return;
    }

    const exists = serviceList.some(service =>
        Number(service.roomNo) === roomNo &&
        service.serviceType === serviceType &&
        service.status === 'Pending'
    );

    if (exists) {
        alert('This room already has the same pending service.');
        return;
    }

    serviceList.push({
        id: `SER${Date.now()}`,
        roomNo,
        serviceType,
        status: 'Pending',
        createdAt: new Date().toISOString()
    });

    saveServices();
    renderServices();
    document.getElementById('serviceRoomNo').value = '';
}

function finishService(serviceId) {
    const service = serviceList.find(item => item.id === serviceId);

    if (!service) {
        return;
    }

    service.status = 'Done';
    service.finishedAt = new Date().toISOString();
    saveServices();
    renderServices();
}

function deleteService(serviceId) {
    if (!confirm('Delete this service record?')) {
        return;
    }

    serviceList = serviceList.filter(item => item.id !== serviceId);
    saveServices();
    renderServices();
}

function renderServices() {
    const tbody = document.getElementById('serviceBody');

    if (!tbody) {
        return;
    }

    tbody.innerHTML = '';

    serviceList.forEach(service => {
        const tr = document.createElement('tr');
        const isDone = service.status === 'Done';
        tr.innerHTML = `
            <td>${service.roomNo}</td>
            <td>${serviceLabels[service.serviceType] || service.serviceType}</td>
            <td><span class="badge ${isDone ? 'badge-done' : 'badge-pending'}">${serviceStatusLabels[service.status] || service.status}</span></td>
            <td>
                <button class="btn-success" onclick="finishService('${service.id}')" ${isDone ? 'disabled' : ''}>Complete</button>
                <button class="btn-warning" onclick="deleteService('${service.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    saveServices();
    renderServices();
});
