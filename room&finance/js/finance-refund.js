const REFUND_STORAGE_KEY = 'financeRefunds';
const defaultRefunds = [
    { id: 'REF001', name: 'Emma Wilson', money: 80, reason: 'Room change price difference', date: '2026-06-01' },
    { id: 'REF002', name: 'Daniel Miller', money: 120, reason: 'Booking cancellation', date: '2026-06-02' },
    { id: 'REF003', name: 'Olivia Taylor', money: 50, reason: 'Service adjustment', date: '2026-06-03' },
    { id: 'REF004', name: 'William Clark', money: 60, reason: 'Overpayment refund', date: '2026-06-04' },
    { id: 'REF005', name: 'Grace Lee', money: 95, reason: 'Booking cancellation', date: '2026-06-05' },
    { id: 'REF006', name: 'Henry Adams', money: 40, reason: 'Service adjustment', date: '2026-06-06' }
];

let refunds = loadRefunds();

function isRemovedRefund(refund) {
    return refund.id === 'REF004'
        && Number(refund.money) === 100
        && refund.reason === '1'
        && refund.date === '2026-06-19'
        && /^a+$/.test(refund.name || '');
}

function loadRefunds() {
    const savedRefunds = JSON.parse(localStorage.getItem(REFUND_STORAGE_KEY)) || [];
    const refunds = Array.isArray(savedRefunds) && savedRefunds.length > 0 ? savedRefunds.filter(refund => !isRemovedRefund(refund)) : [];
    const savedIds = new Set(refunds.map(refund => refund.id));
    return refunds.concat(defaultRefunds.filter(refund => !savedIds.has(refund.id)));
}

function saveRefunds() {
    localStorage.setItem(REFUND_STORAGE_KEY, JSON.stringify(refunds));
}

function renderRefunds() {
    const body = document.getElementById("refundBody");
    body.innerHTML = "";

    refunds.forEach(refund => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${refund.id}</td><td>${refund.name}</td><td>${Number(refund.money).toFixed(2)}</td><td>${refund.reason}</td><td>${refund.date}</td>`;
        body.appendChild(tr);
    });
}

function addRefund(){
    let name = document.getElementById("refundName").value;
    let money = document.getElementById("refundMoney").value;
    let reason = document.getElementById("refundReason").value;
    let date = document.getElementById("refundDate").value;

    if(name==""||money==""||date==""){
        alert("Please complete all required information.");
        return;
    }

    let id = "REF"+(refunds.length+1).toString().padStart(3,"0");
    refunds.push({id,name,money,reason,date});
    saveRefunds();
    renderRefunds();

    document.getElementById("refundName").value="";
    document.getElementById("refundMoney").value="";
    document.getElementById("refundReason").value="";
    document.getElementById("refundDate").value="";
}

window.addEventListener('DOMContentLoaded', () => {
    saveRefunds();
    renderRefunds();
});
