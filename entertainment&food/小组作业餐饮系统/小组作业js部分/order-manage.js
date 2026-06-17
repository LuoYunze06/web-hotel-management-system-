document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".btn-box button");
  var table = document.querySelector("table");
  var rows = Array.prototype.slice.call(table.querySelectorAll("tr")).slice(1);
  var selected = 0;

  function selectRow(index) {
    selected = index;

    rows.forEach(function (row, i) {
      row.style.outline = i === selected ? "2px solid #c8912f" : "none";
    });
  }

  function getStatus(row) {
    return row.querySelector(".status");
  }

  function setStatus(text, className) {
    var status = getStatus(rows[selected]);
    status.textContent = text;
    status.className = "status " + className;
  }

  rows.forEach(function (row, index) {
    row.onclick = function () {
      selectRow(index);
    };

    row.querySelector("button").onclick = function (event) {
      event.stopPropagation();
      alert(
        "Order No.: " +
          row.cells[0].textContent +
          "\nTable No.: " +
          row.cells[1].textContent +
          "\nDishes: " +
          row.cells[2].textContent,
      );
    };
  });

  buttons[0].onclick = function () {
    setStatus("In Progress", "doing");
    alert("Order status changed to In Progress.");
  };

  buttons[1].onclick = function () {
    setStatus("Canceled", "cancel");
    alert("Order has been canceled.");
  };

  buttons[2].onclick = function () {
    table.tBodies[0].insertBefore(rows[selected], rows[0]);
    rows = Array.prototype.slice.call(table.querySelectorAll("tr")).slice(1);
    selected = 0;
    selectRow(0);
    alert("Order has been pinned to the top.");
  };

  buttons[3].onclick = function () {
    table.scrollIntoView({ behavior: "smooth", block: "start" });
    alert("Order list has been refreshed.");
  };

  selectRow(0);
});
