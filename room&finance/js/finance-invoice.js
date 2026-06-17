const INVOICE_STORAGE_KEY = 'financeInvoices';
const defaultInvoices = [
    { id: 'INV001', name: 'Alice Johnson', money: 199, type: 'General Invoice', date: '2026-06-01' },
    { id: 'INV002', name: 'Michael Brown', money: 299, type: 'Special Invoice', date: '2026-06-01' },
    { id: 'INV003', name: 'Sophia Davis', money: 499, type: 'General Invoice', date: '2026-06-02' },
    { id: 'INV004', name: 'Ethan Harris', money: 799, type: 'Special Invoice', date: '2026-06-03' },
    { id: 'INV005', name: 'Mia Turner', money: 1299, type: 'General Invoice', date: '2026-06-04' },
    { id: 'INV006', name: 'Noah Walker', money: 299, type: 'General Invoice', date: '2026-06-05' }
];

let invoices = loadInvoices();

function loadInvoices() {
    const savedInvoices = JSON.parse(localStorage.getItem(INVOICE_STORAGE_KEY)) || [];
    const invoices = Array.isArray(savedInvoices) && savedInvoices.length > 0 ? savedInvoices : [];
    const savedIds = new Set(invoices.map(invoice => invoice.id));
    return invoices.concat(defaultInvoices.filter(invoice => !savedIds.has(invoice.id)));
}

function saveInvoices() {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
}

function renderInvoices() {
    const body = document.getElementById("invoiceBody");
    body.innerHTML = "";

    invoices.forEach(invoice => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${invoice.id}</td><td>${invoice.name}</td><td>${invoice.type}</td><td>${Number(invoice.money).toFixed(2)}</td><td>${invoice.date}</td>`;
        body.appendChild(tr);
    });
}

function addInvoice(){
    let name = document.getElementById("invName").value;
    let money = document.getElementById("invMoney").value;
    let type = document.getElementById("invType").value;
    let date = document.getElementById("invDate").value;

    if(name==""||money==""||date==""){
        alert("Please complete all fields.");
        return;
    }

    let id = "INV"+(invoices.length+1).toString().padStart(3,"0");
    invoices.push({id,name,money,type,date});
    saveInvoices();
    renderInvoices();

    document.getElementById("invName").value="";
    document.getElementById("invMoney").value="";
    document.getElementById("invDate").value="";
}

window.addEventListener('DOMContentLoaded', () => {
    saveInvoices();
    renderInvoices();
});
