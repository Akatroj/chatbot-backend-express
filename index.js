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
  // const startDate = agent.parameters.dataspotkania;
  // console.log(agent.contexts);
  console.log("dupa");
  // console.log(agent.context.contexts);
  const { imie, nazwisko, adresklienta, dataspotkania } = agent.contexts.find(obj => obj.name === 'adres-klienta-followup').parameters;
  console.log(adresklienta, imie, nazwisko, dataspotkania);
  // const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
  // const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
  // const appointmentTimeString = dateTimeStart.toLocaleString(
  //    'en-US',
  //    { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
  //  );
  // makeAppointment();
  agent.send('DUPSKO');
}

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
})

