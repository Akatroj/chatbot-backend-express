const express = require('express');
const { google } = require('googleapis');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Dziala'));

app.post('/dialogflow', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  const intentMap = new Map();
  const intentName = 'Rezultat';
  intentMap.set(intentName, intentHandler);
  agent.handleRequest(intentMap);
  console.log(agent.intent);
});

function intentHandler(agent) {
  agent.add("dzialam!");
}

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})
