'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = Schema({
    type: String,
    title: String,
    subtitle: String,
    description: String,
    datepublic: Date,
    image: String
});

module.exports = mongoose.model('Note', NoteSchema);