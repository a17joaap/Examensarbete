const button = document.getElementById("get-stream");
const resultsBox = document.getElementById("resultsbox");
const processingContainer = document.getElementById("processingContainer");


button.addEventListener("click", () => {
    const algorithm = document.querySelector('input[name="algorithm"]:checked');
    if (!algorithm) {
        alert("Pick an algorithm");
        return;
    }
    toggleProcessingBox();
    button.disabled = true;
    let ajaxURL = "/Home/StartStream/?algorithm=" + algorithm.value;
    $.ajax({
        type: "POST",
        url: ajaxURL,
        success: function (res, status, xhr) {
            waitForResult();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});

function waitForResult() {
    $.ajax({
        type: "GET",
        url: "/Home/GetResult",
        success: function (res, status, xhr) {
            displayResult(res);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function toggleProcessingBox() {
    if (processingContainer.style.display === "block") {
        processingContainer.style.display = "none";
    } else {
        processingContainer.style.display = "block";
        if (document.getElementById("result-list")) {
            resultsBox.removeChild(document.getElementById("result-list"));
        }
    }
}

function displayResult(input) {
    toggleProcessingBox();
    res = JSON.parse(input);
    const list = document.createElement("ul");
    list.id = "result-list";

    res.forEach((obj) => {
        const item = document.createElement("li");
        item.innerHTML = JSON.stringify(obj);
        list.appendChild(item);
    });

    resultsBox.appendChild(list);
    button.disabled = false;
}
