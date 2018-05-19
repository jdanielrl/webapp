'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsletterSchema = Schema({
    email: String,
    datepublic: Date
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);