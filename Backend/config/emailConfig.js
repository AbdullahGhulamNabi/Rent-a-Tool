const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send tool request confirmation email
const sendToolRequestEmail = async (userEmail, toolName, requestDate) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Tool Request Confirmation',
            html: `
                <h2>Tool Request Confirmation</h2>
                <p>Your request for the following tool has been received:</p>
                <p><strong>Tool:</strong> ${toolName}</p>
                <p><strong>Request Date:</strong> ${requestDate}</p>
                <p>We will process your request and notify you once it's approved.</p>
                <p>Thank you for using our Tool Rental Service!</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendToolRequestEmail
}; 