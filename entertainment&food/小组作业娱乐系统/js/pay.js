document.addEventListener("DOMContentLoaded", function () {
  var tableSelect = document.getElementById("payTableNo");
  var modeSelect = document.getElementById("payMode");
  var payButton = document.getElementById("payBtn");
  var invoiceButton = document.getElementById("invoice");
  var recordButton = document.getElementById("payRecord");
  var billItems = document.querySelectorAll(".bill-item");
  var records = [];
  var prices = {
    "KTV Room 1": 198,
    "SPA Room 1": 268,
    "Gym Equipment Area": 88,
    "Heated Pool": 128,
    "Chess Room 1": 108,
  };

  function money(value) {
    return value.toFixed(1).replace(".0", "") + " Yuan";
  }

  function getPayType() {
    var value = document.querySelector('input[name="payType"]:checked').value;
    if (value === "card") return "Bank Card";
    if (value === "mobile") return "Mobile Payment";
    return "Cash";
  }

  function getBill() {
    var project = tableSelect.value;
    var price = prices[project];
    var discount = price * 0.1;
    var total = price - discount;

    if (modeSelect.value === "Prepayment") {
      total = total * 0.5;
    }

    return {
      project: project,
      price: price,
      discount: discount,
      total: total,
      mode: modeSelect.value,
      payType: getPayType(),
    };
  }

  function updateBill() {
    var bill = getBill();
    billItems[0].children[1].textContent = bill.project;
    billItems[1].children[1].textContent = money(bill.price);
    billItems[2].children[1].textContent =
      "10% Off (-" + money(bill.discount) + ")";
    billItems[3].children[1].textContent = money(bill.total);
  }

  function showPayInfo(title, bill) {
    alert(
      title +
        "\nItem: " +
        bill.project +
        "\nMethod: " +
        bill.payType +
        "\nMode: " +
        bill.mode +
        "\nAmount: " +
        money(bill.total),
    );
  }

  tableSelect.onchange = updateBill;
  modeSelect.onchange = updateBill;

  document.querySelectorAll('input[name="payType"]').forEach(function (radio) {
    radio.onchange = updateBill;
  });

  payButton.onclick = function () {
    var bill = getBill();
    records.push(bill);
    showPayInfo("Payment Complete", bill);
  };

  invoiceButton.onclick = function () {
    if (records.length === 0) {
      alert("Please complete payment before generating an invoice.");
      return;
    }

    showPayInfo("Invoice Generated", records[records.length - 1]);
  };

  recordButton.onclick = function () {
    if (records.length === 0) {
      alert("No payment records yet.");
      return;
    }

    var text = records
      .map(function (record, index) {
        return (
          index +
          1 +
          ". " +
          record.project +
          " / " +
          record.payType +
          " / " +
          money(record.total)
        );
      })
      .join("\n");

    alert("Payment Records:\n" + text);
  };

  updateBill();
});
