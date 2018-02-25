// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account



var json  = '{"users": { "name": "Jane Doe", "dates": { "date": "February 25th, 2018","medicineLog": { "morning": "10:56 am","afternoon": "3:07 pm","night": "7:27 pm"} }}}';
obj = JSON.parse(json);
var mes = "";

const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

client.messages.create(
  {
    body: obj.users.name + " took her medicine in the morning at " + obj.users.dates.medicineLog.morning,
    to: '+14086031769',
    from: '+14159425019',
    //mediaUrl: 'http://www.example.com/cheeseburger.png',
  },
  (err, message) => {
    process.stdout.write(message.sid);
  }
);