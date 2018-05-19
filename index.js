'use strict'

var mongoose = require('mongoose');
var app = require('./app');
// var port = process.env.PORT || 3987;
var port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
mongoose.connect('mongodb://localhost:27017/cafesociety', (err, res) => {
    // mongoose.connect('mongodb://cafesocietyadmin:123456@ds115350.mlab.com:15350/cafesociety', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("La base de datos está corriendo correctamente....");
        app.listen(port, function() {
            console.log("Servidor del api rest escuchando en http://localhost:" + port);
        });
    }
});