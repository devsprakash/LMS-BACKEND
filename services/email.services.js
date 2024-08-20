const nodemailer = require('nodemailer');
const { EMAIL_FORM , PASSWORD_FORM } = require('../keys//development.keys');



exports.sendMail = async (text, email) => {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_FORM,
            pass: PASSWORD_FORM,
        },
    });

    try {
        const mailOptions = {
            from: {
                name: 'ATIIT GLOBAL PRIVATE LIMITED',
                address: EMAIL_FORM,
            },
            to: email,
            text: text,
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // rethrow the error to handle it in the calling function if needed
    }
};
