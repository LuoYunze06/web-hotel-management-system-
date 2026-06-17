document.addEventListener("DOMContentLoaded", function () {
  var itemSelect = document.getElementById("evalItem");
  var contentInput = document.getElementById("content");
  var submitButton = document.getElementById("submitEvaluate");
  var showButton = document.getElementById("showEvaluate");
  var table = document.querySelector("table");

  function getScore() {
    return document.querySelector('input[name="score"]:checked').value;
  }

  function getStars(score) {
    var text = "";

    for (var i = 1; i <= 5; i++) {
      text += i <= score ? "\u2605" : "\u2606";
    }

    return text;
  }

  function today() {
    var date = new Date();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function addEvaluateRow(item, score, content) {
    var row = table.insertRow(1);
    var star = document.createElement("span");

    star.className = "star";
    star.textContent = getStars(Number(score));
    row.insertCell(0).textContent = item;
    row.insertCell(1).appendChild(star);
    row.insertCell(2).textContent = content || "No detailed review provided.";
    row.insertCell(3).textContent = today();
  }

  submitButton.onclick = function () {
    var item = itemSelect.value;
    var score = getScore();
    var content = contentInput.value.trim();

    addEvaluateRow(item, score, content);
    contentInput.value = "";
    alert("Review submitted successfully.");
  };

  showButton.onclick = function () {
    table.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    alert("All reviews are now displayed on the page.");
  };
});
