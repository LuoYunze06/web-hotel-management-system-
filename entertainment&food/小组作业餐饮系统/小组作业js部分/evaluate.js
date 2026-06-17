document.addEventListener("DOMContentLoaded", function () {
  var submitBtn = document.getElementById("submitEvalBtn");
  var showBtn = document.getElementById("showEvaluate");
  var textarea = document.querySelector("textarea");
  var form = document.querySelector(".form-wrap");
  var evaluations = [];
  var list = document.createElement("div");

  list.className = "tips";
  list.style.display = "none";
  form.parentNode.insertBefore(list, form.nextSibling);

  function getScore() {
    return document.querySelector('input[name="score"]:checked').value;
  }

  function renderList() {
    list.innerHTML = "<strong>Review Records:</strong>";

    if (evaluations.length === 0) {
      var empty = document.createElement("p");
      empty.textContent = "No reviews yet.";
      list.appendChild(empty);
      return;
    }

    evaluations.forEach(function (item, index) {
      var p = document.createElement("p");
      p.textContent =
        index + 1 + ". " + item.score + " stars - " + item.content;
      list.appendChild(p);
    });
  }

  submitBtn.onclick = function () {
    var content = textarea.value.trim();

    if (content === "") {
      alert("Please enter review content.");
      return;
    }

    evaluations.push({
      score: getScore(),
      content: content,
    });

    textarea.value = "";
    renderList();
    list.style.display = "block";
    alert("Review submitted successfully.");
  };

  showBtn.onclick = function () {
    renderList();
    list.style.display = "block";
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  };
});
