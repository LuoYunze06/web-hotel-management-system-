document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "hotelEntertainmentBookings";
  var usernameInput = document.getElementById("username");
  var itemTypeSelect = document.getElementById("itemType");
  var bookTimeInput = document.getElementById("bookTime");
  var submitButton = document.getElementById("submitBook");
  var queryButton = document.getElementById("queryBook");
  var cancelButton = document.getElementById("cancelBook");
  var orderList = document.querySelector(".order-list");

  var bookings = [];

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function formatTime(value) {
    if (!value) {
      return "";
    }

    return value.replace("T", " ");
  }

  function readSavedBookings() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function getFormData() {
    return {
      id: createId(),
      name: usernameInput.value.trim(),
      item: itemTypeSelect.value,
      time: bookTimeInput.value,
      status: "Submitted",
      isInitial: false,
    };
  }

  function addExistingOrders() {
    var existingItems = orderList.querySelectorAll(".order-item");

    existingItems.forEach(function (item) {
      var title = item.querySelector("strong");
      var time = item.querySelector("span");
      var status = item.querySelector(".status");

      bookings.push({
        id: createId(),
        name: "",
        item: title ? title.textContent.trim() : "Existing Order",
        time: time ? time.textContent.trim() : "",
        status: status ? status.textContent.trim() : "Confirmed",
        isInitial: true,
      });
    });
  }

  function renderBookings() {
    orderList.innerHTML = "";

    if (bookings.length === 0) {
      var empty = document.createElement("div");
      empty.className = "order-item";
      empty.textContent = "No booking records.";
      orderList.appendChild(empty);
      return;
    }

    bookings.forEach(function (booking) {
      var item = document.createElement("div");
      item.className = "order-item";
      item.style.gridTemplateColumns = "1fr auto auto auto";

      var title = document.createElement("strong");
      title.textContent = booking.isInitial
        ? booking.item
        : booking.item + " - " + booking.name;

      var time = document.createElement("span");
      time.textContent = booking.isInitial ? booking.time : formatTime(booking.time);

      var status = document.createElement("span");
      status.className = "status";
      status.textContent = booking.status;

      var deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.onclick = function () {
        deleteBooking(booking.id);
      };

      item.appendChild(title);
      item.appendChild(time);
      item.appendChild(status);
      item.appendChild(deleteButton);
      orderList.appendChild(item);
    });
  }

  function deleteBooking(id) {
    bookings = bookings.filter(function (booking) {
      return booking.id !== id;
    });
    saveBookings();
    renderBookings();
  }

  function hasTimeConflict(newBooking) {
    return bookings.some(function (booking) {
      return booking.item === newBooking.item && booking.time === newBooking.time;
    });
  }

  submitButton.onclick = function () {
    var booking = getFormData();

    if (!booking.name) {
      alert("Please enter the booker name.");
      usernameInput.focus();
      return;
    }

    if (!booking.time) {
      alert("Please select a booking time.");
      bookTimeInput.focus();
      return;
    }

    if (hasTimeConflict(booking)) {
      alert("This entertainment item is already booked for the selected time. Please choose another time.");
      return;
    }

    bookings.push(booking);
    saveBookings();
    renderBookings();
    alert("Booking successful. The record has been added to the page.");
  };

  queryButton.onclick = function () {
    renderBookings();
    document.querySelector(".order-panel").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    alert("There are currently " + bookings.length + " booking records.");
  };

  cancelButton.onclick = function () {
    var name = usernameInput.value.trim();
    var item = itemTypeSelect.value;
    var time = bookTimeInput.value;
    var beforeCount = bookings.length;

    if (!name && !time) {
      alert("Please enter a booker name or select a booking time before canceling.");
      return;
    }

    bookings = bookings.filter(function (booking) {
      var nameMatched = name ? booking.name === name : true;
      var itemMatched = booking.item.indexOf(item) !== -1;
      var timeMatched = time ? booking.time === time : true;

      return !(nameMatched && itemMatched && timeMatched);
    });

    saveBookings();
    renderBookings();

    if (bookings.length === beforeCount) {
      alert("No matching booking record was found.");
    } else {
      alert("The booking record has been canceled.");
    }
  };

  bookings = readSavedBookings();
  if (bookings.length === 0) {
    addExistingOrders();
    saveBookings();
  }
  renderBookings();
});
