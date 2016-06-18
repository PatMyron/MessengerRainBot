var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

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
