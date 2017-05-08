// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

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

var userCount = 0;

wss.on('connection', (ws) => {
  console.log('Client connected');
  userCount++;
  console.log("Current online user number:",userCount);
  var outGoingMsg;

  wss.clients.forEach(function each(client) {
    outGoingMsg = {
      type: "onlineUserCount",
      content: `${userCount} users online`
    };
    client.send(JSON.stringify(outGoingMsg));
  });

  ws.on('message', function incoming(message) {
    console.log("On the server side incoming message is: ",message);
    outGoingMsg = JSON.parse(message);
    switch(outGoingMsg.type) {
      case 'postMessage':
        outGoingMsg.id = uuidV1();
        outGoingMsg.type = 'incomingMessage';
        break;
      case 'postNotification':
        console.log("it's a notification!!");
        outGoingMsg.type = "incomingNotification";
        break;
      default:
        console.log("Unrecognized post event!!");
      }
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(outGoingMsg));
    });
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    userCount--;
    var info = `${userCount} users online`;
    console.log("within server js," ,info);
    wss.clients.forEach(function each(client) {
      outGoingMsg = {
        type: "onlineUserCount",
        content: info
      };
      client.send(JSON.stringify(outGoingMsg));
    });
  });
});