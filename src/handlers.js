'use strict';

const { makeAppointment, canMakeAppointment } = require('./calendar.js');

function calculateCost(agent) {
  const [duze, srednie, male] = [...agent.parameters.panele, 0, 0, 0]; // jak dialogflow zczyta mniej niz 3 parametry to je tutaj wyzerujemy

  let cena = 8000 * male + 18000 * srednie + 36000 * duze;
  cena = (cena > 0) ? cena + 100 : 0;
  agent.context.delete('wyliczenie-ceny-followup');
  agent.add(`Instalacja ${duze} dużych paneli, ${srednie} średnich paneli oraz ${male} małych paneli kosztowałaby około ${cena} złotych. Czy chcesz umówić się na spotkanie w celu instalacji tych paneli?`);
}

async function checkDate(agent) {
  const { data } = agent.parameters;
  const startDate = new Date(data.date_time ?? data);
  console.log(startDate);
  const appointmentTimeString = startDate.toLocaleString('pl-PL');
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);

  if (startDate < Date.now()) {
    agent.add('Ten termin już przeminął...');
    return;
  }
  else if (startDate.getFullYear() > new Date().getFullYear() + 1) {
    agent.add('Ten termin jest zbyt późno!');
    return;
  }

  try {
    const result = await canMakeAppointment(startDate, endDate);
    if (!result) throw new Error("test");
    agent.context.set('Czy-termin-wolny-followup', 1);
    agent.add(`Tak, ${appointmentTimeString} mamy wolny termin. Czy chcesz umówić się na spotkanie?`);
  }
  catch (err) {
    console.log(err);
    agent.add('Niestety, w tym terminie jesteśmy zajęci. Możesz spróbować w innym terminie.');
  }
}

async function createAppointment(agent) {
  const { imie, nazwisko, adresklienta, dataspotkania } = agent.contexts.find(obj => obj.name === 'adres-klienta-followup').parameters;

  const startDate = new Date(dataspotkania.date_time ?? dataspotkania);
  const appointmentTimeString = startDate.toLocaleString('pl-PL');
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);

  const clientName = imie + ' ' + nazwisko;
  const clientAddress = Object.values(adresklienta).filter(entry => entry !== '').toString();

  if (startDate < Date.now()) {
    agent.add('Ten termin już przeminął...');
    return;
  }
  else if (startDate.getFullYear() > new Date().getFullYear() + 1) {
    agent.add('Ten termin jest zbyt późno!');
    return;
  }

  try {
    const result = await makeAppointment(startDate.toISOString(), endDate.toISOString(), clientName, clientAddress);
    agent.add(`Zarezerwowałam termin spotkania na ${appointmentTimeString}.`);
  } catch (err) {
    console.log(err);
    agent.add('Niestety, nie udało się utworzyć spotkania. Proszę spróbować w innym terminie.');
  }
}

module.exports = {
  calculateCost,
  checkDate,
  createAppointment
}
