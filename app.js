const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('./config/config');
const apiRoutes = require('./route/route');

app.use(bodyParser.urlencoded({   //Parse the request object
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(url.configUrl, { useNewUrlParser: true, useUnifiedTopology: true });  //Connection of Database

const db = mongoose.connection;

if (!db)
    console.log("Error Connecting In Database.");
else
    console.log("Product Database Connected Successfully.");

app.get('/', (req, res) => {
    res.send('Initial route');
});

app.use('/api/v1', apiRoutes);  //Routes

app.listen(port, () => {  //Running Port
    console.log('Server running on 8000');
});