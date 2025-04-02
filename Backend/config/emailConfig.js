const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Email configuration loading...');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Error verifying email transporter:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

// Function to send tool request notification to tool owner
const sendToolRequestEmail = async (ownerEmail, toolName, requesterName, requestDate) => {
    try {
        console.log('Preparing to send email to:', ownerEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ownerEmail,
            subject: 'New Tool Request',
            html: `
                <h2>New Tool Request</h2>
                <p>Someone has requested to rent your tool:</p>
                <p><strong>Tool:</strong> ${toolName}</p>
                <p><strong>Requester:</strong> ${requesterName}</p>
                <p><strong>Request Date:</strong> ${requestDate}</p>
                <p>Please check your dashboard to review and respond to this request.</p>
                <p>Thank you for using our Tool Rental Service!</p>
            `
        };

        console.log('Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

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