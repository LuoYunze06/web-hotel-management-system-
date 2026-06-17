document.addEventListener("DOMContentLoaded", function () {
  var payType = document.getElementById("payType");
  var discountType = document.getElementById("discountType");
  var payBtn = document.getElementById("payBtn");
  var invoiceBtn = document.getElementById("invoice");
  var billItems = document.querySelectorAll(".bill-item");
  var paid = false;
  var baseMoney = 198;

  function money(value) {
    return value.toFixed(1).replace(".0", "") + " Yuan";
  }

  function getDiscount() {
    var type = discountType.value;

    if (type.indexOf("9") !== -1) {
      return baseMoney * 0.1;
    }

    if (type.indexOf("50") !== -1 || type.indexOf("0") !== -1) {
      return baseMoney >= 200 ? 50 : 0;
    }

    return 0;
  }

  function updateBill() {
    var discount = getDiscount();
    billItems[0].children[1].textContent = money(baseMoney);
    billItems[1].children[1].textContent = "-" + money(discount);
    billItems[2].children[1].textContent = money(baseMoney - discount);
  }

  payType.onchange = updateBill;
  discountType.onchange = updateBill;

  payBtn.onclick = function () {
    paid = true;
    alert(
      "Payment successful.\nPayment method: " +
        payType.value +
        "\nPaid amount: " +
        billItems[2].children[1].textContent,
    );
  };

  invoiceBtn.onclick = function () {
    if (!paid) {
      alert("Please complete payment before generating an invoice.");
      return;
    }

    alert(
      "Invoice generated.\nAmount: " +
        billItems[2].children[1].textContent,
    );
  };

  updateBill();
});
