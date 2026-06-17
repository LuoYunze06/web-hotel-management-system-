const defaultPriceList = [
    { id: 'PRI001', type: 'Single Room', price: 299, note: 'Economy room for single occupancy' },
    { id: 'PRI002', type: 'Double Room', price: 499, note: 'Basic room type for one or two guests' },
    { id: 'PRI003', type: 'Family Room', price: 799, note: 'Designed for family stays' },
    { id: 'PRI004', type: 'Deluxe Suite', price: 1299, note: 'Premium suite with upgraded amenities' }
];

let priceList = normalizePriceList(JSON.parse(localStorage.getItem('roomPrices')) || defaultPriceList);

function normalizePriceList(prices) {
    const allowedTypes = defaultPriceList.map(item => item.type);
    const savedByType = new Map();

    if (Array.isArray(prices)) {
        prices.forEach(item => {
            if (allowedTypes.includes(item.type) && !savedByType.has(item.type)) {
                savedByType.set(item.type, item);
            }
        });
    }

    return defaultPriceList.map(defaultItem => ({
        ...defaultItem,
        ...(savedByType.get(defaultItem.type) || {}),
        id: defaultItem.id,
        type: defaultItem.type,
        price: defaultItem.price
    }));
}

function savePrices() {
    localStorage.setItem('roomPrices', JSON.stringify(priceList));
}

function renderTypeOptions() {
    const roomTypeSelect = document.getElementById('roomType');
    roomTypeSelect.innerHTML = '';

    priceList.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.type;
        roomTypeSelect.appendChild(option);
    });
}

function renderPriceTable() {
    const tbody = document.getElementById('priceBody');
    tbody.innerHTML = '';

    priceList.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.type}</td>
            <td>${Number(item.price).toFixed(2)}</td>
            <td>${item.note || '-'}</td>
            <td><button onclick="selectPrice('${item.id}')">Edit</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function loadSelectedPrice() {
    const selectedId = document.getElementById('roomType').value;
    const selectedPrice = priceList.find(item => item.id === selectedId);

    if (!selectedPrice) {
        document.getElementById('roomPrice').value = '';
        document.getElementById('priceNote').value = '';
        return;
    }

    document.getElementById('roomPrice').value = selectedPrice.price;
    document.getElementById('priceNote').value = selectedPrice.note || '';
}

function selectPrice(id) {
    document.getElementById('roomType').value = id;
    loadSelectedPrice();
    document.getElementById('roomPrice').focus();
}

function updatePrice() {
    const selectedId = document.getElementById('roomType').value;
    const price = Number(document.getElementById('roomPrice').value);
    const note = document.getElementById('priceNote').value.trim();
    const selectedPrice = priceList.find(item => item.id === selectedId);

    if (!selectedPrice) {
        alert('Please select a room type to update.');
        return;
    }

    if (!Number.isFinite(price) || price < 0) {
        alert('Please enter a valid room price.');
        return;
    }

    selectedPrice.price = price;
    selectedPrice.note = note;
    savePrices();
    renderPriceTable();
    alert('Room price updated.');
}

window.addEventListener('DOMContentLoaded', () => {
    savePrices();
    renderTypeOptions();
    renderPriceTable();
    loadSelectedPrice();
});
