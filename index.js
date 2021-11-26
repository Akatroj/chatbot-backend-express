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
  intentMap.set('Oblicz-koszt', calculateCost);
  agent.handleRequest(intentMap);
  console.log(agent.intent);
});

function calculateCost(agent) {
  console.log(agent.parameters.panele);
  const [duze, srednie, male] = [...agent.parameters.panele, 0, 0, 0]; // jak dialogflow zczyta mniej niz 3 parametry to je tutaj wyzerujemy

  let cena = 8000 * male + 18000 * srednie + 36000 * duze;
  cena = (cena > 0) ? cena + 100 : 0;
  agent.clearOutgoingContexts();
  agent.add(`Instalacja ${duze} dużych paneli, ${srednie} średnich paneli oraz ${male} małych paneli kosztowałaby około ${cena} złotych.`);
}

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})
