'use strict'

var express = require('express');
var NoteController = require('../controllers/note');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/notes' });

api.post('/saveNote', md_auth.ensureAuth, NoteController.saveNote);
api.get('/getNote/:id', md_auth.ensureAuth, NoteController.getNote);
api.get('/getNoteFront/:id', NoteController.getNote);
api.get('/getNotes/:page?', md_auth.ensureAuth, NoteController.getNotes);
api.get('/getNotesFront/:page?', NoteController.getNotesFront);
api.put('/updateNote/:id', md_auth.ensureAuth, NoteController.updateNote);
api.delete('/deleteNote/:id', md_auth.ensureAuth, NoteController.deleteNote);
api.post('/uploadImageNote/:id', [md_auth.ensureAuth, md_upload], NoteController.uploadImageNote);
//api.get('/get-image-artist/:imageFile', [md_auth.ensureAuth, md_upload], ArtistController.getImageFile);
api.get('/getImageNote/:imageFile', NoteController.getImageNote);

module.exports = api;