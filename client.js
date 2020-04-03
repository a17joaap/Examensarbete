window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket('ws://localhost:3000');
const jsonButton = document.getElementById('jsonButton');

jsonButton.addEventListener('click', () => {
    connection.send('hejhej');
})

connection.onopen = () => {

}

connection.onerror = (err) => {
    console.log(err);
}

connection.onmessage = (json) => {

}