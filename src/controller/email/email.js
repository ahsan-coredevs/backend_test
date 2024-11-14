const nodemailer = require('nodemailer');

function sendMail(mailOptions, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null);
        } else { 
            callback(null, info);
        }
    });
}

module.exports = sendMail;
