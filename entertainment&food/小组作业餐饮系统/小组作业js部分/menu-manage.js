document.addEventListener("DOMContentLoaded", function () {
  var nameInput = document.getElementById("menuName");
  var priceInput = document.getElementById("menuPrice");
  var typeInput = document.getElementById("menuType");
  var saveBtn = document.getElementById("saveMenuBtn");
  var editBtn = document.getElementById("editFood");
  var upBtn = document.getElementById("upFood");
  var downBtn = document.getElementById("downFood");
  var form = document.querySelector(".form-wrap");
  var menus = [];
  var selected = -1;
  var list = document.createElement("div");

  list.className = "tips";
  form.parentNode.insertBefore(list, form.nextSibling);

  function renderMenus() {
    list.innerHTML = "<strong>Dish List:</strong>";

    if (menus.length === 0) {
      list.innerHTML += "<p>No dishes yet.</p>";
      return;
    }

    menus.forEach(function (menu, index) {
      var p = document.createElement("p");
      p.textContent =
        index +
        1 +
        ". " +
        menu.name +
        " / " +
        menu.price +
        " Yuan / " +
        menu.type +
        " / " +
        menu.status;
      p.onclick = function () {
        selected = index;
        nameInput.value = menu.name;
        priceInput.value = menu.price;
        typeInput.value = menu.type;
      };
      list.appendChild(p);
    });
  }

  function getFormMenu() {
    return {
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      type: typeInput.value.trim(),
      status: "Active",
    };
  }

  saveBtn.onclick = function () {
    var menu = getFormMenu();

    if (!menu.name || !menu.price || !menu.type) {
      alert("Please complete the dish information.");
      return;
    }

    menus.push(menu);
    renderMenus();
    alert("Dish saved successfully.");
  };

  editBtn.onclick = function () {
    if (selected < 0) {
      alert("Please select the dish to edit first.");
      return;
    }

    menus[selected] = getFormMenu();
    renderMenus();
    alert("Dish updated successfully.");
  };

  upBtn.onclick = function () {
    if (selected >= 0) menus[selected].status = "Active";
    renderMenus();
  };

  downBtn.onclick = function () {
    if (selected >= 0) menus[selected].status = "Inactive";
    renderMenus();
  };

  renderMenus();
});
