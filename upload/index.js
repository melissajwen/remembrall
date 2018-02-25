'use strict';
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const table = 'MedicineIntake';
const docClient = new AWS.DynamoDB.DocumentClient();

const APP_ID = "amzn1.ask.skill.02eaae4b-ac4e-4988-afd0-5959d2ba4fcd";

const HELP_MESSAGE = 'You can ask me how many times you have taken medicine today, or log medicine intake. What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

// Twilio authentication
const accountSid = 'ACc85366426e50b5e1274e63390bae3f0d';
const authToken = 'bf8dada94af2c7078f7699e9ea6ad024';
const client = require('twilio')(accountSid, authToken);

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = 
   {
     userName: 'remembrallAdmin', // update me
     password: 'redChair1029', // update me
     server: 'remembrall.database.windows.net', // update me
     options: 
        {
           database: 'remembrall' //update me
           , encrypt: true
        }
   }
const connection = new Connection(config);

function queryDatabase() {
    connection.on('connect', function(err) {
        if (err) console.log(err);
        else {
            request = new Request(
                "SELECT * from Medicine",
                function(err, rowCount, rows) {
                    console.log(rowCount + ' row(s) returned');
                    process.exit();
                }
            );

            var ret = "";
            request.on('row', function(columns) {
                columns.forEach(function(column) {
                    ret = column.value;
                });
            });
            connection.execSql(request);
            return ret;
        }

    });
}

function send_sms(body) {
    console.log("inside send_sms()");

    client.messages.create({
        body: body,
        to: '+14086031769',
        from: '+14159425019'
    }, (err, message) => { process.stdout.write(message.sid); });
}

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
        var h = today.getHours() - 8;
        var mae = "";
        if (h > 6 && h <= 11) mae = "morning";
        else if (h > 11 && h <= 5) mae = "afternoon";
        else mae = "evening";
        if (h > 12) h -= 12;

        var m = today.getMinutes();     
        var ampm = h >= 12 ? 'pm' : 'am';   

        var month = today.getMonth();
        if (month == 0) month = "January";
        else if (month == 1) month = "February";
        else if (month == 2) month = "March";
        else if (month == 3) month = "April";
        else if (month == 4) month = "May";
        else if (month == 5) month = "June";
        else if (month == 6) month = "July";
        else if (month == 7) month = "August";
        else if (month == 8) month = "September";
        else if (month == 9) month = "October";
        else if (month == 10) month = "November";
        else if (month == 11) month = "December";
        var day = today.getDate();
        var confirmation = "Medicine intake at " + h + ":" + m + " " + ampm + ". You still have to take medicine today after dinner.";

        // Send text to contact
        client.messages.create({
            body: "Medicine intake logged at 10 AM.",
            to: '+14086031769',
            from: '+14159425019',
        }).then(message => process.stdout.write(message.sid));
        process.stdout.write(message.sid)

        var body = "Medicine intake logged at " + h + ":" + m + " " + ampm + ".";
        send_sms(body);
        
        client.messages.create({
            body: "Let's grab lunch at Milliways tomorrow!",
            to: '+14086031769',
            from: '+14159425019',
            //mediaUrl: 'http://www.example.com/cheeseburger.png',
        }, (err, message) => { process.stdout.write(message.sid); });

        console.log("!!!!!BEFORE EVERYTHING", mae);
        if (mae == "morning") {
            console.log("!!!! morning");
            console.log("table name", table);
            var params = {
                TableName: table,
                // Item: {
                //     "Date": date,
                //     "Morning": h + ":" + m + " " + ampm,
                //     "Afternoon": "0",
                //     "Evening": "0"
                // }
                Key: {
                    "Date": "february 25"
                }
            };
            console.log("before get");
            docClient.get(params, function(err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
            // docClient.put(params, function(err, data) {
            //     console.log("!!!!callback");
            //     console.log("error", err);
            //     if (err) {
            //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            //     } else {
            //         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            //     }
            // });
            console.log("!!!result");
        } else if (mae == "afternoon") {
            var params = {
                TableName: table,
                Key:{
                    "Date": date
                },
                UpdateExpression: "set afternoon=:a",
                ExpressionAttributeValues:{
                    ":a": h + ":" + m + " " + ampm
                },
                ReturnValues:"UPDATED_NEW"
            }; 

            console.log("Updating the item...");
            docClient.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
        } else {
            console.log("!!!! everning");
            console.log("table name", table);
            var params = {
                TableName: table,
                Key:{
                    "Date": date
                },
                UpdateExpression: "set evening=:e",
                ExpressionAttributeValues:{
                    ":e": h + ":" + m + " " + ampm
                },
                ReturnValues:"UPDATED_NEW"
            }; 

            console.log("Updating the item...");
            docClient.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
            console.log("END updating!");
        }
        
        this.response.speak(confirmation).listen(HELP_REPROMPT);
        this.emit(':responseReady');

        // var code = "var " + name + " = " + value + ";\n";
        // var data = new FormData();
        // data.append("code", code);
        // var url = ""; // endpoint 
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
        var response = "You have taken medicine today at " + times[0][0] + ":" + times[0][1] + " " + times[0][2];
        for (i = 1; i < times.length(); ++i) {
            if (i == times.length() - 1) {
                response += ", and at " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
                break;
            }
            response += ", " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
        }
        var today = new Date();
        var h = today.getHours() - 8;
        var m = today.getMinutes();     
        var ampm = h >= 12 ? 'pm' : 'am';   

        var response = "You last took your medicine at " + h + ":" + m + " " + ampm + ". The next time you take medication is at five P M";
        this.response.speak(response).listen(HELP_REPROMPT);
        this.emit(':responseReady');
    },
    'HelpIntent': function () {
        var response = "Calling an emergency contact. Please wait...";
        this.response.speak(response);
        this.emit(':responseReady');
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