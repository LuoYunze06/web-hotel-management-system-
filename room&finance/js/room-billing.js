const PAYMENT_STORAGE_KEY = 'roomPaymentRecords';
const defaultPaymentRecords = [
    { id: 'PAY001', roomNo: '101', amount: 299, paidAt: '2026-06-01 10:20:00' },
    { id: 'PAY002', roomNo: '202', amount: 499, paidAt: '2026-06-01 12:45:00' },
    { id: 'PAY003', roomNo: '301', amount: 299, paidAt: '2026-06-02 09:30:00' }
];

let paymentRecords = loadPaymentRecords();

function loadPaymentRecords() {
    const savedRecords = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY)) || [];
    const records = Array.isArray(savedRecords) && savedRecords.length > 0 ? savedRecords : defaultPaymentRecords;

    return records.map(record => ({
        ...record,
        roomNo: record.id === 'PAY002' ? '202' : record.id === 'PAY003' ? '301' : record.roomNo,
        amount: record.id === 'PAY001' ? 299 : record.id === 'PAY002' ? 499 : record.id === 'PAY003' ? 299 : record.amount
    }));
}

function savePaymentRecords() {
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentRecords));
}

function showBillResult(message, isError = false) {
    const result = document.getElementById('billResult');
    result.style.color = isError ? '#ff4d4f' : '#333';
    result.textContent = message;
}

function formatDateTime(date) {
    const pad = value => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function renderPaymentRecords() {
    const tbody = document.getElementById('billBody');
    tbody.innerHTML = '';

    paymentRecords.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.id}</td>
            <td>${record.roomNo}</td>
            <td>${record.amount.toFixed(2)}</td>
            <td>${record.paidAt}</td>
        `;
        tbody.appendChild(tr);
    });
}

function confirmPayment() {
    const roomNoInput = document.getElementById('billingRoomNo');
    const amountInput = document.getElementById('paymentAmount');
    const roomNo = roomNoInput.value.trim();
    const amount = Number(amountInput.value);

    if (!roomNo) {
        showBillResult('Please enter the room number.', true);
        roomNoInput.focus();
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        showBillResult('Please enter a valid payment amount greater than 0.', true);
        amountInput.focus();
        return;
    }

    const record = {
        id: `PAY${String(paymentRecords.length + 1).padStart(3, '0')}`,
        roomNo,
        amount,
        paidAt: formatDateTime(new Date())
    };

    paymentRecords.push(record);
    savePaymentRecords();
    renderPaymentRecords();
    showBillResult(`Payment confirmed. Record ${record.id} has been saved on this page.`);

    roomNoInput.value = '';
    amountInput.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    savePaymentRecords();
    renderPaymentRecords();
});
