const express = require('express');
const { google } = require('googleapis');
const { WebhookClient } = require('dialogflow-fulfillment');

const { makeAppointment, canMakeAppointment } = require('./calendar.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Dziala'));

app.post('/dialogflow', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  const intentMap = new Map();
  intentMap.set('Oblicz-koszt', calculateCost);
  intentMap.set('Data-spotkania', createAppointment);
  agent.handleRequest(intentMap);
  console.log(agent.intent);
});

function calculateCost(agent) {
  const [duze, srednie, male] = [...agent.parameters.panele, 0, 0, 0]; // jak dialogflow zczyta mniej niz 3 parametry to je tutaj wyzerujemy

  let cena = 8000 * male + 18000 * srednie + 36000 * duze;
  cena = (cena > 0) ? cena + 100 : 0;
  agent.context.delete();
  agent.add(`Instalacja ${duze} dużych paneli, ${srednie} średnich paneli oraz ${male} małych paneli kosztowałaby około ${cena} złotych.`);
}

function createAppointment(agent) {
  const { imie, nazwisko, adresklienta, dataspotkania } = agent.contexts.find(obj => obj.name === 'adres-klienta-followup').parameters;
  // console.log(adresklienta, imie, nazwisko, dataspotkania);
  const startDate = new Date(dataspotkania.date_time || dataspotkania);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);

  const clientName = imie + ' ' + nazwisko;
  const clientAddress = Object.values(adresklienta).toString();

  const appointmentTimeString = startDate.toLocaleString('pl-PL');
  agent.contexts.length = 0;
  return makeAppointment(startDate.toISOString(), endDate.toISOString(), clientName, clientAddress).then(result => {
    // console.log(result);
    agent.add(`Zarezerwowałam termin spotkania na ${appointmentTimeString}.`)
  }).catch(err => {
    console.log(err);
    agent.add('Niestety, nie udało się utworzyć spotkania. Proszę spróbować w innym terminie.');
  });
}

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})

