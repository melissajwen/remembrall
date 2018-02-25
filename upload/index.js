'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.02eaae4b-ac4e-4988-afd0-5959d2ba4fcd";

const HELP_MESSAGE = 'You can ask me how many times you have taken medicine today, or log medicine intake. What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

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
        var m = today.getMinutes();
        const confirmation = "Okay, I have logged your medicine intake at " + h + ":" + m + "PM.";
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
        var response = "You have taken medicine today at " + times[0][0] + ":" + times[0][1] + " " + times[0][2];
        // for (i = 1; i < times.length(); ++i) {
        //     if (i == times.length() - 1) {
        //         response += ", and at " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
        //         break;
        //     }
        //     response += ", " + times[i][0] + ":" + times[i][1] + " " + times[i][2];
        // }
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