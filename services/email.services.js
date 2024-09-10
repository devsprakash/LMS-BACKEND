const nodemailer = require('nodemailer');
// const { EMAIL_FORM , PASSWORD_FORM } = require('../keys//development.keys');


exports.sendMail = async (text, email) => {
 
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailer91.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'emailer@atiitglobal.com', // your SMTP username
            pass: 'nop5PDPOLYqyYKHk',        // your SMTP password
        },
    });


try {
    
let mailOptions = {
    from: '<connect@atiitglobal.com>', 
    to: email,                                     
    subject: "Welcome to ATIIT GLOBAL PRIVATE LIMITED – Your Learning Journey Begins Here! 🎉" ,                             
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