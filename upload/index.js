'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.02eaae4b-ac4e-4988-afd0-5959d2ba4fcd";

const HELP_MESSAGE = 'You can ask me how many times you have taken medicine today, or log medicine intake. What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

// Twilio authentication
const accountSid = 'ACc85366426e50b5e1274e63390bae3f0d';
const authToken = 'bf8dada94af2c7078f7699e9ea6ad024';
const client = require('twilio')(accountSid, authToken);

// const Connection = require('tedious').Connection;
// const Request = require('tedious').Request;

// const config = 
//    {
//      userName: 'remembrallAdmin', // update me
//      password: 'redChair1029', // update me
//      server: 'remembrall.database.windows.net', // update me
//      options: 
//         {
//            database: 'remembrall' //update me
//            , encrypt: true
//         }
//    }
// const connection = new Connection(config);

// function queryDatabase() {
//     connection.on('connect', function(err) {
//         if (err) console.log(err);
//         else {
//             request = new Request(
//                 "SELECT * from Medicine",
//                 function(err, rowCount, rows) {
//                     console.log(rowCount + ' row(s) returned');
//                     process.exit();
//                 }
//             );

//             var ret = "";
//             request.on('row', function(columns) {
//                 columns.forEach(function(column) {
//                     ret = column.value;
//                 });
//             });
//             connection.execSql(request);
//             return ret;
//         }

//     });
// }

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.response.speak("You have launched Remembrall.").listen(HELP_REPROMPT);
        this.emit(':responseReady');
    },
    'LogIntent': function () {
        var today = new Date();
        var h = today.getHours() + 4;
        if (h > 12) h -= 12;
        var m = today.getMinutes();        
        const confirmation = "Okay, I have logged your medicine intake at " + h + ":" + m + "AM." + " You still have to take medicine today after dinner.";

        // // Send text to contact
        // client.messages.create({
        //     body: "Medicine intake logged at " + h + ":" + m + "AM.",
        //     to: '+16509317103',
        //     from: '+14159425019',
        // }).then(message => process.stdout.write(message.sid));
        // //process.stdout.write(message.sid)

        // var body = "Medicine intake logged at " + h + ":" + m + "AM.";
        // client.messages.create({
        //     body: body,
        //     to: '+14086031769',
        //     from: '+14159425019',
        //     //mediaUrl: 'http://www.example.com/cheeseburger.png',
        // }, (err, message) => { process.stdout.write(message.sid); });

        client.messages.create({
            body: "Let's grab lunch at Milliways tomorrow!",
            to: '+14086031769',
            from: '+14159425019',
            //mediaUrl: 'http://www.example.com/cheeseburger.png',
        }, (err, message) => { process.stdout.write(message.sid); });

        this.response.speak(confirmation).listen(HELP_REPROMPT);
        this.emit(':responseReady');

        // var code = "var " + name + " = " + value + ";\n";
        // var data = new FormData();
        // data.append("code", code);
        // var url = "https://yonniluu.lib.id/api@dev/updateCode/"; // endpoint 
        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", url, true);
        // xhr.onreadystatechange = function() {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         console.log(xhr.responseText);
        //     }
        // }
        // xhr.send(body);
    },
    'QueryIntent': function () {
        // get array
        var times = [["9", "13", "AM"], ["12", "13", "PM"]];
        // var response = "You have taken medicine today at " + times[0][0] + ":" + times[0][1] + " " + times[0][2];
        // for (i = 1; i < times.length(); ++i) {
        //     if (i == times.length() - 1) {
        //         response += ", and at " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
        //         break;
        //     }
        //     response += ", " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
        // }
        var response = queryDatabase();
        this.response.speak(response).listen(HELP_REPROMPT);
        this.emit(':responseReady');

        // var code = "for (i in range(" + beg + ", " + end + "):{\n}";
        // var data = new FormData();
        // data.append("code", code);
        // var url = "https://yonniluu.lib.id/api@dev/updateCode/"; // endpoint
        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", url, true);
        // xhr.onreadystatechange = function() {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         console.log(xhr.responseText);
        //     }
        // }
        // xhr.send(code);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};