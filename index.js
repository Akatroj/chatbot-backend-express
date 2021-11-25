const express = require('express');
const { google } = require('googleapis');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Dziala'));

app.post('/dialogflow', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  const intentMap = new Map();
  const intentName = 'Wyliczenieceny.Wyliczenieceny-custom.Iloduychpaneli-custom.Ilorednichpaneli-next.Ilomaychpaneli-yes'; // i'm sorry...
  intentMap.set(intentName, intentHandler);
  agent.handleRequest(intentMap);
});

function intentHandler(agent) {
  agent.add("dzialam!");
}

app.listen(3000, () => {
  console.log("Server is Running on port 3000")
})
