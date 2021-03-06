'use strict';

const { google } = require('googleapis');


const calendarID = process.env.CALENDARID;
const client_email = process.env.CLIENT_EMAIL;
const private_key = JSON.parse(process.env.PRIVATE_KEY ?? '{}');


const serviceAccountAuth = new google.auth.JWT({
  email: client_email,
  key: private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');

async function canMakeAppointment(dateTimeStart, dateTimeEnd) {
  const calendarResponse = await calendar.events.list({
    auth: serviceAccountAuth, // List events for time period
    calendarId: calendarID,
    timeMin: dateTimeStart,
    timeMax: dateTimeEnd
  });
  return calendarResponse.data.items.length == 0;
}

async function makeAppointment(dateTimeStart, dateTimeEnd, clientName, clientAddress) {
  const isFree = await canMakeAppointment(dateTimeStart, dateTimeEnd);
  if (!isFree) throw new Error("Termin zajety");
  const result = await calendar.events.insert({
    auth: serviceAccountAuth,
    calendarId: calendarID,
    resource: {
      summary: `Spotkanie z ${clientName}`,
      description: `Wycena usług dla ${clientName} mieszkającego pod adresem ${clientAddress}`,
      start: { dateTime: dateTimeStart },
      end: { dateTime: dateTimeEnd }
    }
  });
  return result;
}

module.exports = {
  makeAppointment,
  canMakeAppointment
}
