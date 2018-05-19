'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Newsletter = require('../models/newsletter');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');
const nodemailer = require('nodemailer');

function saveNewsletter(req, res) {

    var params = req.body;
    var email = params.email;
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    let transporter = nodemailer.createTransport({
        host: 'mail.cafesociety.pe',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@cafesociety.pe', // generated ethereal user
            pass: 'Info2018;;' // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });


    // verify connection configuration
    /*
    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });
    */

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Newsletter Cafesociety 👻" <webhome@cafesociety.com>', // sender address
        to: 'jdanielrl@gmail.com, fmerinocordova@gmail.com', // list of receivers
        subject: 'Registro al newsletter cafesociety.pe', // Subject line
        text: 'Hola por favor subscribirme al newsletter de cafesociety.pe, mi email es: ' + email, // plain text body
        html: '<b>Hola por favor subscribirme al newsletter de cafesociety.pe</b><br>Mi correo es: ' + email // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        // Grabando newsletter en base de datos
        //grabaNewsletter(req, res);

    });



    res.status(200).send({
        //message: 'Probando una acción del controlador de usuarios del api rest con Node y MongoDB'
        message: 'Terminando de enviar el mail'
    });
}

function grabaNewsletter(req, res) {
    var news = new Newsletter();
    var params = req.body;
    news.email = params.email;
    news.datepublic = new Date();
    news.save((err, newsStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el newsletter' });
        } else {
            if (!newsStored) {
                res.status(404).send({ message: 'No se ha registrado el newsletter' });
            } else {
                res.status(200).send({ newsletter: newsStored });
            }
        }
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    //user.role = params.role;
    user.role = 'ROLE_USER';
    //user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        // Encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // Guardar el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });
            } else {
                // Faltan datos
                res.status(200).send({ message: 'Introduce todos los campos' });
            }
        });
    } else {
        // Si no viene password
        res.status(200).send({ message: 'Introduce la contraseña' });
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;
    //res.status(200).send({ message: 'Respuesta desde loginUser' });
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(404).send({ message: 'El usuario no existe' });
            } else {
                //res.status(200).send({ message: 'El usuario si existe' });
                // Comprobaremos la contraseña para ver si es la misma que la enviada por parámetro
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        // Es correcto con lo cual se devolvará los datos del usuario logueado
                        //res.status(200).send({ message: 'El password es el mismo' });
                        if (params.gethash) {
                            // Devolver un token de jwt
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        // No es correcto
                        res.status(404).send({ message: 'La contraseña es incorrecta' });
                    }
                });
            }
        }
    });

}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar la imagen del usuario' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar la imagen del usuario' });
                    } else {
                        res.status(200).send({ image: file_name, user: userUpdated });
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

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    fs.exists('./uploads/users/' + imageFile, function(exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/users/' + imageFile));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
    saveNewsletter,
    grabaNewsletter
};