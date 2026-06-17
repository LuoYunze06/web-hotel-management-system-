const FINANCE_STORAGE_KEY = 'financeAddedRecords';
const defaultFinanceRecords = [
    { id: 'FIN001', type: 'Income', category: 'Room Fee', money: 159, date: '2026-03-25' },
    { id: 'FIN002', type: 'Income', category: 'Room Fee', money: 99, date: '2026-03-25' },
    { id: 'FIN003', type: 'Expense', category: 'Room Supplies', money: -250, date: '2026-03-24' },
    { id: 'FIN004', type: 'Expense', category: 'Utility Bill', money: -380, date: '2026-03-23' },
    { id: 'FIN005', type: 'Income', category: 'Extra Service', money: 45, date: '2026-03-25' },
    { id: 'FIN006', type: 'Income', category: 'Room Fee', money: 299, date: '2026-03-26' },
    { id: 'FIN007', type: 'Income', category: 'Extra Service', money: 68, date: '2026-03-26' },
    { id: 'FIN008', type: 'Expense', category: 'Room Supplies', money: -180, date: '2026-03-26' },
    { id: 'FIN009', type: 'Expense', category: 'Utility Bill', money: -420, date: '2026-03-27' },
    { id: 'FIN010', type: 'Income', category: 'Room Fee', money: 499, date: '2026-03-27' }
];

let records = loadFinanceRecords();

function loadFinanceRecords() {
    const savedRecords = JSON.parse(localStorage.getItem(FINANCE_STORAGE_KEY)) || [];
    const records = Array.isArray(savedRecords) && savedRecords.length > 0 ? savedRecords : [];
    const savedIds = new Set(records.map(record => record.id));
    return records.concat(defaultFinanceRecords.filter(record => !savedIds.has(record.id)));
}

function saveRecords() {
    localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(records));
}

function getNextRecordId() {
    return `FIN${String(records.length + 1).padStart(3, '0')}`;
}

function showFinanceResult(message, isError = false) {
    const result = document.getElementById('financeResult');
    result.style.color = isError ? '#ff4d4f' : '#333';
    result.textContent = message;
}

function appendRecordToTable(record) {
    const tbody = document.getElementById('financeBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${record.id}</td>
        <td>${record.type}</td>
        <td>${record.category}</td>
        <td>${Number(record.money).toFixed(2)}</td>
        <td>${record.date}</td>
    `;
    tbody.appendChild(tr);
}

function renderSavedRecords() {
    document.getElementById('financeBody').innerHTML = '';
    records.forEach(appendRecordToTable);
    renderFinanceSummary();
}

function renderFinanceSummary() {
    const income = records
        .filter(record => record.type === 'Income')
        .reduce((sum, record) => sum + Number(record.money), 0);
    const expense = records
        .filter(record => record.type === 'Expense')
        .reduce((sum, record) => sum + Math.abs(Number(record.money)), 0);
    const profit = income - expense;

    document.getElementById('financeTotalIncome').textContent = income.toFixed(2);
    document.getElementById('financeTotalExpense').textContent = expense.toFixed(2);
    document.getElementById('financeProfit').textContent = profit.toFixed(2);
}

function AddFinance() {
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const moneyInput = document.getElementById('money');
    const dateInput = document.getElementById('Date');

    const type = typeSelect.value;
    const category = categorySelect.options[categorySelect.selectedIndex].text;
    const money = Number(moneyInput.value);
    const date = dateInput.value;

    if (!type || !category || !moneyInput.value || !date) {
        showFinanceResult('Please fill in all fields.', true);
        return;
    }

    if (!Number.isFinite(money)) {
        showFinanceResult('Please enter a valid amount.', true);
        return;
    }

    const id = getNextRecordId();
    const record = { id, type, category, money, date };
    records.push(record);
    saveRecords();
    appendRecordToTable(record);
    renderFinanceSummary();

    showFinanceResult(`Record ${id} has been added and displayed below.`);

    typeSelect.selectedIndex = 0;
    categorySelect.selectedIndex = 0;
    moneyInput.value = '';
    dateInput.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    saveRecords();
    renderSavedRecords();
});
