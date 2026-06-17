document.addEventListener("DOMContentLoaded", function () {
  var nameInput = document.getElementById("itemName");
  var priceInput = document.getElementById("itemPrice");
  var durationInput = document.getElementById("itemDuration");
  var addButton = document.getElementById("addItem");
  var editButton = document.getElementById("editItem");
  var upButton = document.getElementById("upItem");
  var downButton = document.getElementById("downItem");
  var table = document.querySelector("table");
  var selectedRow = null;

  function bindRow(row) {
    row.onclick = function () {
      if (selectedRow) {
        selectedRow.style.outline = "none";
      }

      selectedRow = row;
      row.style.outline = "2px solid #c8912f";
      nameInput.value = row.cells[0].textContent;
      priceInput.value = row.cells[1].textContent;
      durationInput.value = row.cells[2].textContent;
    };
  }

  function getFormData() {
    return {
      name: nameInput.value.trim(),
      price: priceInput.value.trim(),
      duration: durationInput.value.trim(),
    };
  }

  function checkForm(data) {
    if (!data.name || !data.price || !data.duration) {
      alert("Please complete the item information.");
      return false;
    }

    if (Number(data.price) <= 0 || Number(data.duration) <= 0) {
      alert("Price and duration must be greater than 0.");
      return false;
    }

    return true;
  }

  function clearForm() {
    nameInput.value = "";
    priceInput.value = "";
    durationInput.value = "";
  }

  function setStatus(text) {
    if (!selectedRow) {
      alert("Please select an item first.");
      return;
    }

    selectedRow.cells[3].textContent = text;
  }

  Array.prototype.slice.call(table.querySelectorAll("tr")).slice(1).forEach(bindRow);

  addButton.onclick = function () {
    var data = getFormData();

    if (!checkForm(data)) {
      return;
    }

    var row = table.insertRow(-1);
    row.insertCell(0).textContent = data.name;
    row.insertCell(1).textContent = data.price;
    row.insertCell(2).textContent = data.duration;
    row.insertCell(3).textContent = "Active";
    bindRow(row);
    clearForm();
    alert("Item added successfully.");
  };

  editButton.onclick = function () {
    var data = getFormData();

    if (!selectedRow) {
      alert("Please select the item to edit first.");
      return;
    }

    if (!checkForm(data)) {
      return;
    }

    selectedRow.cells[0].textContent = data.name;
    selectedRow.cells[1].textContent = data.price;
    selectedRow.cells[2].textContent = data.duration;
    alert("Item edited successfully.");
  };

  upButton.onclick = function () {
    setStatus("Active");
  };

  downButton.onclick = function () {
    setStatus("Inactive");
  };
});
