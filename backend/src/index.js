const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const channels = {};

function sendEventsToAll(event, channelId) {
  if (!channels[channelId]) {
    channels[channelId] = [];
  }

  channels[channelId].forEach((c) =>
    c.res.write(`data: ${JSON.stringifY(event)} \n\n`)
  );
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/:channelId/send', (req, res) => {
  const { channelId } = req.params;

  //store the message then boardcast to all clients
  sendEventsToAll(req.body, channelId);

  res.send('ok');
});

app.get('/:channelId/listen', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream' });

  const { channelId } = req.params;
  const clientId = Date.now();

  if (!channels[channelId]) {
    channels[channelId] = [];
  }
  channels[channelId].push({
    id: clientId,
    res
  });

  const data = `data: ${JSON.stringify([
    {
      username: "Bot",
      message: "Welcome! Happy to see you ;)",
      time: Date.now(),
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