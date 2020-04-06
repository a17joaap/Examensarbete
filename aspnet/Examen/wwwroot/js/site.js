window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket("ws://localhost:3000");
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
    connection.send("hejhej");
    button.disabled = true;
});

connection.onerror = (err) => {
    console.log(err);
};

connection.onmessage = (message) => {
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
};

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
}
