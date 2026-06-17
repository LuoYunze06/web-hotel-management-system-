document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "hotelEntertainmentBookings";
  var table = document.querySelector("table");
  var dataRows = table ? Array.prototype.slice.call(table.querySelectorAll("tr")).slice(1) : [];
  var originalRows = dataRows.map(function (row) {
    var cells = row.querySelectorAll("td");
    var status = cells[2] ? cells[2].querySelector(".status") : null;

    return {
      row: row,
      name: cells[0] ? cells[0].textContent.trim() : "",
      type: cells[1] ? cells[1].textContent.trim() : "",
      statusText: status ? status.textContent.trim() : "",
      statusClass: status ? status.className : "status status-free",
    };
  });

  function readBookings() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function bookingUsesFacility(booking, facilityType) {
    return booking.item && booking.item.indexOf(facilityType) !== -1;
  }

  function setStatus(rowInfo, text, className) {
    var status = rowInfo.row.querySelector(".status");

    if (!status) {
      return;
    }

    status.textContent = text;
    status.className = className;
  }

  function renderBookingSummary(bookings) {
    var summary = document.getElementById("bookingSyncSummary");

    if (!summary) {
      summary = document.createElement("div");
      summary.id = "bookingSyncSummary";
      summary.className = "tips";
      table.parentNode.insertBefore(summary, table.nextSibling);
    }

    summary.innerHTML = "";

    var title = document.createElement("strong");
    title.textContent = "Booking Sync:";
    summary.appendChild(title);

    if (bookings.length === 0) {
      var empty = document.createElement("p");
      empty.textContent = "No booking records. Related facilities remain available or keep their original status.";
      summary.appendChild(empty);
      return;
    }

    bookings.forEach(function (booking) {
      var time = booking.time ? booking.time.replace("T", " ") : "No time provided";
      var name = booking.name || "Existing system order";
      var item = document.createElement("p");
      item.textContent = booking.item + " / " + name + " / " + time;
      summary.appendChild(item);
    });
  }

  function refreshFacilityStatus() {
    var bookings = readBookings();

    originalRows.forEach(function (rowInfo) {
      var isUsed = bookings.some(function (booking) {
        return bookingUsesFacility(booking, rowInfo.type);
      });

      if (isUsed) {
        setStatus(rowInfo, "In Use", "status status-used");
      } else if (rowInfo.statusText === "Under Maintenance") {
        setStatus(rowInfo, rowInfo.statusText, rowInfo.statusClass);
      } else {
        setStatus(rowInfo, "Available", "status status-free");
      }
    });

    renderBookingSummary(bookings);
  }

  document.getElementById("roomStatus").onclick = function () {
    refreshFacilityStatus();
    alert("Facility status has been refreshed.");
  };

  document.getElementById("facilityLog").onclick = function () {
    alert("Maintenance records are displayed.");
  };

  document.getElementById("fixBtn").onclick = function () {
    alert("Maintenance request submitted.");
  };

  var allocateButton = document.getElementById("allocateBtn");
  if (allocateButton) {
    allocateButton.onclick = function () {
      refreshFacilityStatus();
      alert("Resource allocation has been updated based on booking records.");
    };
  }

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) {
      refreshFacilityStatus();
    }
  });

  refreshFacilityStatus();
});
