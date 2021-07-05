const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const channels = {};

function sendEventsToAll(event, channelId) {
  if (!channels[channelId]) {
    channels[channelId] = [];
    console.log('channels', channels);
  }

  channels[channelId].forEach((c) =>
    c.res.write(`data: ${JSON.stringify(event)} \n\n`)
  );
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/:channelId/send', (req, res) => {
  const { channelId } = req.params;

  //store the message then boardcast to all clients
  sendEventsToAll(req.body, channelId);
  console.log('req.body', req.body);
  console.log('channelId', channelId);
  res.send('ok');
});

app.get('/:channelId/listen', (req, res) => {
  console.log('request.hostname', req.hostname);
  console.log('req.ip', req.ip);
  console.log('req.originalUrl', req.originalUrl);
  res.writeHead(200, { 'Content-Type': 'text/event-stream' });

  const { channelId } = req.params;
  const clientId = Date.now();

  if (!channels[channelId]) {
    channels[channelId] = [];
  }
  channels[channelId].push({
    id: clientId,
    res,
  });

  const data = `data: ${JSON.stringify([
    {
      username: "Bot",
      message: "Welcome! Happy to see you ;)",
      time: Date.now(),
      hostname: req.hostname,
    },
  ])}\n\n`;


  res.write(data);
  res.on('close', () => {
    channels[channelId] = channels[channelId].filter((c) => c.id !== clientId);
  });
});


app.listen(3000, () => {
  console.log('SSE chat app listening on port 3000!');
});