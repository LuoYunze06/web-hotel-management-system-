const COST_STORAGE_KEY = 'financeCosts';
const defaultCosts = [
    { id: 'COS001', type: 'Daily Supplies Purchase', money: 250, note: 'Guest room amenities', date: '2026-06-01' },
    { id: 'COS002', type: 'Utility Cost', money: 380, note: 'Electricity and water bill', date: '2026-06-02' },
    { id: 'COS003', type: 'Repair Cost', money: 120, note: 'Air conditioner maintenance', date: '2026-06-03' },
    { id: 'COS004', type: 'Daily Supplies Purchase', money: 180, note: 'Cleaning supplies', date: '2026-06-04' },
    { id: 'COS005', type: 'Employee Allowance', money: 300, note: 'Night shift allowance', date: '2026-06-05' },
    { id: 'COS006', type: 'Utility Cost', money: 410, note: 'Gas and water bill', date: '2026-06-06' }
];

let costs = loadCosts();

function loadCosts() {
    const savedCosts = JSON.parse(localStorage.getItem(COST_STORAGE_KEY)) || [];
    const costs = Array.isArray(savedCosts) && savedCosts.length > 0 ? savedCosts : [];
    const savedIds = new Set(costs.map(cost => cost.id));
    return costs.concat(defaultCosts.filter(cost => !savedIds.has(cost.id)));
}

function saveCosts() {
    localStorage.setItem(COST_STORAGE_KEY, JSON.stringify(costs));
}

function renderCosts() {
    const body = document.getElementById("costBody");
    body.innerHTML = "";

    costs.forEach(cost => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${cost.id}</td><td>${cost.type}</td><td>${Number(cost.money).toFixed(2)}</td><td>${cost.note}</td><td>${cost.date}</td>`;
        body.appendChild(tr);
    });
}

function addCost(){
    let type = document.getElementById("costType").value;
    let money = document.getElementById("costMoney").value;
    let note = document.getElementById("costNote").value;
    let date = document.getElementById("costDate").value;

    if(money==""||date==""){
        alert("Please complete all required information.");
        return;
    }

    let id = "COS"+(costs.length+1).toString().padStart(3,"0");
    costs.push({id,type,money,note,date});
    saveCosts();
    renderCosts();

    document.getElementById("costMoney").value="";
    document.getElementById("costNote").value="";
    document.getElementById("costDate").value="";
}

window.addEventListener('DOMContentLoaded', () => {
    saveCosts();
    renderCosts();
});
