'use strict';
/*
Common Mail Function for all controllers
*/
var app = require('express')();
var mailer = require('express-mailer');
var path = require('path');
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'hbs');

mailer.extend(app, {
    from: 'admin@php-gym.com',
    host: 'gator4089.hostgator.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'admin@php-gym.com',
        pass: 'phpgymadmin'
    }
});
module.exports.mail = function(to, subject, message){


    app.mailer.send('email/text.hbs', {
        to: to,
        subject: subject,
        msg: message
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            return false;
        }
        return true;
    });

};
