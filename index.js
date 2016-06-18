var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAAWWpxUBMGoBANlKHUR63Dz2WLZBMHACQRi65zwj46wFSb3aJCThUV4BLwevZCciUDeyVnYpGcfgrzu0reh3XqKdTkZBxVA1HhIfrAhbQjsy5ABYfUFTbfAdck4QmH0vJV6ZCAgAcGdrBl3pMaTQa2eCrPetlsZBHXAjZBIuISOgZDZD') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
		sendMessage(event.sender.id, {text: "Send your location"}); // event.message.text
        }
	else if (event.message) {
		urlBase = "http://api.wunderground.com/api/57fd25cc02e9da86/conditions/forecast/alert/q/"
		lat = event.message.attachments[0].payload.coordinates.lat
		lon = event.message.attachments[0].payload.coordinates.long
		totUrl = urlBase + String(lat) + "," + String(lon) + ".json"
                sendMessage(event.sender.id, {text: totUrl});

request({
    url: url,
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
	sendMessage(event.sender.id, {text: body});
    }
})


	}
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};
