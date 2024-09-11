const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');



exports.sendMail = async (email, user) => {
    try {
        // Create transporter object using SMTP
        let transporter = nodemailer.createTransport({
            host: 'smtp.mailer91.com',  // SMTP host
            port: 587,                  // SMTP port
            secure: false,              // Use SSL if true
            auth: {
                user: 'emailer@atiitglobal.com', // your SMTP username
                pass: 'nop5PDPOLYqyYKHk',        // your SMTP password
            },
        });

        // Path to the template file
        const templatePath = path.join(__dirname, 'welcome_email.html');

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        // Read and compile the template
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        // Replace placeholder values with actual data
        const replacements = {
            name: user,  // Replace {{username}} in the template
        };
        const htmlToSend = template(replacements);

        // Mail options
        let mailOptions = {
            from: '<connect@atiitglobal.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome to ATIIT GLOBAL PRIVATE LIMITED – Your Learning Journey Begins Here! 🎉", // subject
            html: htmlToSend, // email body in HTML format
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;

    } catch (error) {
        console.error('Error sending email:', error.message || error);
        throw error;
    }
};



exports.BookingSendMail = async (user , email, course_name) => {

    try {
    
        let transporter = nodemailer.createTransport({
            host: 'smtp.mailer91.com',  // SMTP host
            port: 587,                  // SMTP port
            secure: false,              // Use SSL if true
            auth: {
                user: 'emailer@atiitglobal.com', // your SMTP username
                pass: 'nop5PDPOLYqyYKHk',        // your SMTP password
            },
        });

        const templatePath = path.join(__dirname, 'pre_booking.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const now = new Date();
        const localDateString = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const localTimeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        const replacements = {
            name: user,
            date:localDateString,
            time:localTimeString,
            course_name:course_name
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Your Booking is Successfully Confirmed 🎉",
            html: htmlToSend,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;

    } catch (error) {
        console.error('Error sending email:', error.message || error);
        throw error;
    }
};



exports.EnrollSendMail = async (user , email, course_name) => {

    try {
    
        let transporter = nodemailer.createTransport({
            host: 'smtp.mailer91.com',  // SMTP host
            port: 587,                  // SMTP port
            secure: false,              // Use SSL if true
            auth: {
                user: 'emailer@atiitglobal.com', // your SMTP username
                pass: 'nop5PDPOLYqyYKHk',        // your SMTP password
            },
        });

        const templatePath = path.join(__dirname, 'enroll_success_email.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            name: user,
            course_name:course_name
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Your Enroll is Successfully Confirmed 🎉",
            html: htmlToSend,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;

    } catch (error) {
        console.error('Error sending email:', error.message || error);
        throw error;
    }
};
