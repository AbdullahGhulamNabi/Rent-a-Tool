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

// Function to send verification email
const sendVerificationEmail = async (userEmail, verificationToken) => {
    try {
        const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Verify Your Email - Rent-a-Tool",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Rent-a-Tool!</h2>
                    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationUrl}" 
                            style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                    <p style="word-break: break-all;">${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

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
    sendToolRequestEmail,
    sendVerificationEmail
}; 