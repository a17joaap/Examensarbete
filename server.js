const http = require('http');
const WebsocketServer = require('websocket').server;


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

wsServer = new WebsocketServer({
    httpServer: server
})

wsServer.on('request', (req) => {
    const connection = req.accept(null, req.origin);


    connection.on('message', (message) => {
        //Start sending JSON
        console.log(message);
    })
})