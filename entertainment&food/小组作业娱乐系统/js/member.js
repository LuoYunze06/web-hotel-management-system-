document.addEventListener("DOMContentLoaded", function () {
  var nameInput = document.getElementById("memberName");
  var phoneInput = document.getElementById("memberPhone");
  var levelSelect = document.getElementById("memberLevel");
  var addButton = document.getElementById("addMember");
  var showButton = document.getElementById("showMember");
  var recordButton = document.getElementById("showRecord");
  var table = document.querySelector("table");

  function maskPhone(phone) {
    if (phone.length === 11) {
      return phone.slice(0, 3) + "****" + phone.slice(7);
    }

    return phone;
  }

  function getLevelClass(level) {
    if (level === "Gold Member") {
      return "level level-gold";
    }

    if (level === "Silver Member") {
      return "level level-silver";
    }

    return "level level-normal";
  }

  function addMemberRow(name, phone, level) {
    var row = table.insertRow(-1);
    var levelSpan = document.createElement("span");

    levelSpan.className = getLevelClass(level);
    levelSpan.textContent = level;

    row.insertCell(0).textContent = name;
    row.insertCell(1).textContent = maskPhone(phone);
    row.insertCell(2).appendChild(levelSpan);
    row.insertCell(3).textContent = "0";
    row.insertCell(4).innerHTML =
      '<button style="padding: 4px 8px; font-size: 12px">Details</button>';
  }

  function findMemberRow(name) {
    var rows = table.querySelectorAll("tr");

    for (var i = 1; i < rows.length; i++) {
      if (rows[i].cells[0].textContent.trim() === name) {
        return rows[i];
      }
    }

    return null;
  }

  addButton.onclick = function () {
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var level = levelSelect.value;

    if (name === "") {
      alert("Please enter the member name.");
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    addMemberRow(name, phone, level);
    nameInput.value = "";
    phoneInput.value = "";
    alert("Member added successfully.");
  };

  showButton.onclick = function () {
    table.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    alert("The member list is now displayed on the page.");
  };

  recordButton.onclick = function () {
    var name = nameInput.value.trim();

    if (name === "") {
      alert("Please enter the member name to search.");
      return;
    }

    var row = findMemberRow(name);

    if (!row) {
      alert("No matching member was found.");
      return;
    }

    alert(
      "Member: " +
        row.cells[0].textContent +
        "\nLevel: " +
        row.cells[2].textContent +
        "\nTotal Spend: " +
        row.cells[3].textContent +
        " Yuan",
    );
  };
});
