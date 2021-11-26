const calendarID = process.env.CALENDARID;
const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;

const functions = require('firebase-functions');
const { google } = require('googleapis');

const serviceAccountAuth = new google.auth.JWT({
  email: client_email,
  key: private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');

module.exports = () => {
  console.log(calendarID, client_email, private_key);
}
