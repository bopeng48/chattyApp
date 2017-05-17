// server.js
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const uuidV1 = require('uuid/v1');

const { onlineUserCount, postMessage, postNotification } = require('./constants.js');

// Set the port to 3001
const PORT = process.env.PORT || 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

const broadcast = (payload) => {
  console.log("Broadcasting", payload);
  const packet = JSON.stringify(payload);
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(packet);
    }
  });
}

const userCountPayload = () => ({
  type: onlineUserCount,
  content: wss.clients.size
});

wss.on('connection', (ws) => {

  broadcast(userCountPayload());

  ws.on('message', function incoming(message) {
    const { type, content, userName } = JSON.parse(message);
    const id = uuidV1();

    switch(type) {
      case postMessage:
      case postNotification:
        broadcast({
          id,
          type,
          content,
          userName
        });
        break;
      default:
        console.error(`Unknown message type ${type}`);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => broadcast(userCountPayload()));
});
