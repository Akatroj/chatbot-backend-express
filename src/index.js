'use strict';

const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const { calculateCost, checkDate, createAppointment } = require('./handlers.js');


const app = express();

const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Dziala'));

app.post('/dialogflow', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  const intentMap = new Map();
  intentMap.set('Oblicz-koszt', calculateCost);
  intentMap.set('Data-spotkania', createAppointment);
  intentMap.set('Czy-termin-wolny', checkDate);

  agent.handleRequest(intentMap);
  console.log(agent.intent);
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})

