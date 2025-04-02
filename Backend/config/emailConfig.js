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

// Function to send tool request notification to tool owner
const sendToolRequestEmail = async (ownerEmail, toolName, requesterName, requestDate) => {
    try {
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