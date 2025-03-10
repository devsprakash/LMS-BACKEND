const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const axios = require('axios'); // Ensure axios is imported




exports.sendMail = async (email, user , password) => {
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
            email:email,
            password:password
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



exports.EnrollSendMail = async (user , email, course_name , password) => {

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
            course_name:course_name,
            email:email,
            password:password
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


exports.OtpSendMail = async (otp , email) => {

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

        const templatePath = path.join(__dirname, 'otp-template.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            otp: otp,
        };

        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "OTP VERIFICATION 🎉",
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




exports.NewUserWelcomeEmail = async (user, email, password) => {

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

        const templatePath = path.join(__dirname, 'new_user_email.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            name: user,
            email:email,
            password:password
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Welcome, Admin! 🎉",
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


/*================================== registration invoice email template ==============================*/



exports.registrationInvoice = async (name,email,phone,courseName,invoiceNumber,date) => {

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

        const templatePath = path.join(__dirname, 'registration-fees.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            name: name,
            email:email,
            phone:phone,
            course_name:courseName,
            invoiceNumber:invoiceNumber,
            date: date,
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Your Registration Fees Invoice is Ready, Admin!",
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



exports.finalInvoice = async (name, email,phone ,courseName ,invoiceNumber , date , total_amount) => {

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

        const templatePath = path.join(__dirname, 'final-price-template.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            name: name,
            email:email,
            phone:phone,
            course_name:courseName,
            invoiceNumber:invoiceNumber,
            date: date,
            total_amount:total_amount
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Your Full Payment Invoice is Ready, Admin!",
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


/*=========================== python regitstartion email ======================*/

exports.PythonRegistrationInvoice = async (name, email,phone ,invoiceNumber , date) => {

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

        const templatePath = path.join(__dirname, 'python-register.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(source);

        const replacements = {
            name: name,
            email:email,
            phone:phone,
            invoiceNumber:invoiceNumber,
            date: date,
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
            from: '<connect@atiitglobal.com>',
            to: email, 
            subject: "Your Registration Fees Invoice is Ready, Admin!",
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




// Function to fetch the Zoho token
exports.fetchZohoToken = async () => {
    let ZOHO_TOKEN;
    const url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.5ab19094e2914d60324ee850bf9c026e.50ff6bde3861ed9ed269ded14f0cb7e9&client_id=1000.H1KFIDBEDRLJIMZKLTFBQ5X2IU35XO&client_secret=bd03c5c99a73e7db590d4e8d4701d953a1f56fe5fc&grant_type=refresh_token`;
    try {
        const response = await axios.post(url);
        console.log('Token created successfully:', response.data);
        ZOHO_TOKEN = response.data.access_token;
    } catch (error) {
        console.error('Error creating Token:', error.response ? error.response.data : error.message);
    }
    return ZOHO_TOKEN;
}


exports.generateFourDigitOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
}


exports.generateInvoiceNumber  = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let invoiceNumber = '';
    for (let i = 0; i < 10; i++) {
      invoiceNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return invoiceNumber;
  }
  