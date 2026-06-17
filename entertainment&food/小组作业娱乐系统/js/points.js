document.addEventListener("DOMContentLoaded", function () {
  var pointUseButton = document.getElementById("pointUse");
  var exchangeButton = document.getElementById("pointExchange");
  var logButton = document.getElementById("pointLog");
  var deductInput = document.getElementById("pointDeduct");
  var giftInput = document.getElementById("pointGift");
  var pointSpan = document.querySelector(".points-info span");
  var table = document.querySelector("table");
  var currentPoints = Number(pointSpan.textContent) || 0;

  function today() {
    var date = new Date();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function updatePoints() {
    pointSpan.textContent = currentPoints;
  }

  function addLog(type, change, remark) {
    var row = table.insertRow(1);
    row.insertCell(0).textContent = today();
    row.insertCell(1).textContent = type;
    row.insertCell(2).textContent = change;
    row.insertCell(3).textContent = remark;
  }

  function usePoints() {
    var money = Number(deductInput.value);
    var needPoints = money * 10;

    if (!money || money < 10) {
      alert("Please enter a deduction amount of at least 10 Yuan.");
      return;
    }

    if (needPoints > currentPoints) {
      alert("Current points are insufficient for this deduction.");
      return;
    }

    currentPoints -= needPoints;
    updatePoints();
    addLog(
      "Points Deduction",
      "-" + needPoints,
      "Deducted " + money + " Yuan from spend",
    );
    deductInput.value = "";
    alert("Points deducted successfully.");
  }

  function exchangeGift() {
    var gift = giftInput.value.trim();
    var cost = 300;

    if (gift === "") {
      alert("Please enter the gift to redeem.");
      return;
    }

    if (cost > currentPoints) {
      alert("Current points are insufficient for this redemption.");
      return;
    }

    currentPoints -= cost;
    updatePoints();
    addLog(
      "Points Redemption",
      "-" + cost,
      "Redeemed " + gift,
    );
    giftInput.value = "";
    alert("Points redeemed successfully.");
  }

  pointUseButton.onclick = usePoints;
  exchangeButton.onclick = exchangeGift;

  logButton.onclick = function () {
    table.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    alert("Points records are now displayed on the page.");
  };

  updatePoints();
});
