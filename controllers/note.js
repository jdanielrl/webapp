'use strict'

var fs = require('fs');
var path = require('path');

var Note = require('../models/note');
var mongoosePaginate = require('mongoose-pagination');



function saveNote(req, res) {
    var note = new Note();

    var params = req.body;
    note.type = params.type;
    note.title = params.title;
    note.subtitle = params.subtitle;
    note.description = params.description;
    note.datepublic = new Date();
    note.image = 'null';


    note.save((err, noteStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar la Nota' });
        } else {
            if (!noteStored) {
                res.status(404).send({ message: 'No se ha registrado la Nota' });
            } else {
                res.status(200).send({ note: noteStored });
            }
        }
    });

}

function getNote(req, res) {
    var noteId = req.params.id;
    Note.findById(noteId, (err, note) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!note) {
                res.status(404).send({ message: 'La Nota no existe' });
            } else {
                res.status(200).send({ note });
            }
        }
    });
}

function getNotes(req, res) {
    var itemsPerPage = 5;
    if (req.params.page) {
        var page = req.params.page;
        //Note.find().sort('title').paginate(page, itemsPerPage, (err, notes, total) => {
        Note.find().sort({ datepublic: -1 }).paginate(page, itemsPerPage, (err, notes, total) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!notes) {
                    res.status(404).send({ message: 'No hay Notas!!!' });
                } else {
                    res.status(200).send({
                        total_items: total,
                        notes: notes
                    });
                }
            }
        });
    } else {
        Note.find((err, notes) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!notes) {
                    res.status(404).send({ message: 'No hay notas' });
                } else {
                    res.status(200).send({
                        notes: notes
                    });
                }
            }
        });
    }
}

function getNotesFront(req, res) {
    var itemsPerPage = 3;
    if (req.params.page) {
        var page = req.params.page;
        //Note.find().sort('title').paginate(page, itemsPerPage, (err, notes, total) => {
        Note.find().sort({ datepublic: -1 }).paginate(page, itemsPerPage, (err, notes, total) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!notes) {
                    res.status(404).send({ message: 'No hay Notas!!!' });
                } else {
                    res.status(200).send({
                        total_items: total,
                        notes: notes
                    });
                }
            }
        });
    } else {
        Note.find((err, notes) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!notes) {
                    res.status(404).send({ message: 'No hay notas' });
                } else {
                    res.status(200).send({
                        notes: notes
                    });
                }
            }
        });
    }
}

function updateNote(req, res) {
    var noteId = req.params.id;
    var update = req.body;
    update.datepublic = new Date();

    Note.findByIdAndUpdate(noteId, update, (err, noteUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar la Nota' });
        } else {
            if (!noteUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar la Nota' });
            } else {
                res.status(200).send({ note: noteUpdated });
            }
        }
    });
}

function deleteNote(req, res) {
    var noteId = req.params.id;
    //console.log('id a ser eliminado' + artistId);

    Note.findOneAndRemove({ _id: noteId }, (err, noteRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar la Nota' });
        } else {
            if (!noteRemoved) {
                res.status(404).send({ message: 'No se ha podido eliminar la Nota' });
            } else {
                res.status(200).send({ note: noteRemoved });
            }
        }
    });
}

function uploadImageNote(req, res) {
    var noteId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            Note.findByIdAndUpdate(noteId, { image: file_name }, (err, noteUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar la imagen de la Nota' });
                } else {
                    if (!noteUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar la imagen de la Nota' });
                    } else {
                        res.status(200).send({ note: noteUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no valido...' });
        }
    } else {
        res.status(200).send({ message: 'No ha subido ninguna imagen...' });
    }
}

function getImageNote(req, res) {
    var imageFile = req.params.imageFile;
    fs.exists('./uploads/notes/' + imageFile, function(exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/notes/' + imageFile));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    saveNote,
    getNote,
    getNotes,
    updateNote,
    deleteNote,
    uploadImageNote,
    getImageNote,
    getNotesFront
};