var express = require('express');

var config = require('./config');
var app = express();

var getNumbers = require('./controllers/get_numbers');
var handleCount = require('./controllers/handle_count');
var test = require('./controllers/test');

app.get('/getlotto', getNumbers.random);
app.get('/getcount', handleCount.getCount);
app.get('/resetcount', handleCount.resetCount);

app.get('/test', test.test);

// Run express server
app.listen(config.server_port, function () {
    console.log('Server is listening on port', config.server_port);
});