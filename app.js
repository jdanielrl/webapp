'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user');
var note_routes = require('./routes/note');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Autorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
// Rutas base
app.use('/', express.static('client',{redirect: false}));
app.use('/admin', express.static('admin',{redirect: false}));
app.use('/api', user_routes);
app.use('/api', note_routes);

app.get('*', function(req, res, next){
    res.sendFile(path.resolve('client/index.html'));
});


module.exports = app;