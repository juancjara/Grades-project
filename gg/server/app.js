var express = require('express'),
    bodyParser = require('body-parser'),
    route = require('./route.js'),
    app = express();

app.use( bodyParser.json());

app.post('/getSemesters',route.getSemesters);

app.listen(8765);
console.log("Express server listening on port 8765");