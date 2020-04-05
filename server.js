const http = require('http');
const WebsocketServer = require('websocket').server;
const fs = require('fs');

const raw = fs.readFileSync(__dirname + '/gpsdata2.json');
const objects = JSON.parse(raw).points;

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => { });

wsServer = new WebsocketServer({
    httpServer: server
})

wsServer.on('request', (req) => {
    const connection = req.accept(null, req.origin);

    connection.on('message', (_) => {
        connection.send('Start');
        while (objects.length > 0) {
            toSend = objects.splice(0, 100);
            connection.send(JSON.stringify(toSend));
        }
        connection.send('End');
    })
})


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});