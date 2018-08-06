const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));

app.all('/', function (req, res) {
    res.send('ok');
});

app.all('/http404', function (req, res) {    
    res.status(404).send('not found');
});

app.all('/http500', function (req, res) {
    res.status(500).send('internal server error');
});

app.all('/wait/:timeoutInMillis', function (req, res) {
    const timeoutInMillis = req.params.timeoutInMillis;
    req.setTimeout(Number.parseFloat(timeoutInMillis) + 200);

    setTimeout(function() {
        res.send();
        }, timeoutInMillis);
    
});

app.all('/socketHangUp', function (req, res) {
    req.setTimeout(1);

    setTimeout(function() {
        res.send();
        }, 1000);
    
});

const port = 3000;
app.listen(port, function () {
    console.log(`listening on port ${port}`);
});