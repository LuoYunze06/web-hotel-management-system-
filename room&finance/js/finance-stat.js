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

function countStat(){
    let month = document.getElementById("statMonth").value;
    let inRoom=0,inService=0,outGoods=0,outBill=0;

    for(let o of records){
        if(o.date.startsWith(month)){
            if(o.category=="Room Fee") inRoom+=Number(o.money);
            if(o.category=="Extra Service") inService+=Number(o.money);
            if(o.category=="Room Supplies") outGoods+=Math.abs(Number(o.money));
            if(o.category=="Utility Bill") outBill+=Math.abs(Number(o.money));
        }
    }

    document.getElementById("inRoom").innerText=inRoom;
    document.getElementById("inService").innerText=inService;
    document.getElementById("outGoods").innerText=outGoods;
    document.getElementById("outBill").innerText=outBill;
    document.getElementById("balance").innerText=inRoom+inService-outGoods-outBill;
}

window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(records));
    document.getElementById("statMonth").value = "2026-03";
    countStat();
});
