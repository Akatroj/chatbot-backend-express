const { google } = require('googleapis');


const calendarID = process.env.CALENDARID;
const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;


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
    timeMin: dateTimeStart.toISOString(),
    timeMax: dateTimeEnd.toISOString()
  });
  return calendarResponse.data.items.length == 0;
}

async function makeAppointment(dateTimeStart, dateTimeEnd) {
  const isFree = await canMakeAppointment(dateTimeStart, dateTimeEnd);
  if (!isFree) throw new Error("Termin zajety");
  const result = await calendar.events.insert({
    auth: serviceAccountAuth,
    calendarId: calendarID,
    resource: {
      summary: appointment_type + ' Appointment', description: appointment_type,
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
