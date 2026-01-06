require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Testing Email Configuration...");
    console.log(`User: ${process.env.EMAIL_USER}`);
    // console.log(`Pass: ${process.env.EMAIL_PASS}`); // Don't log password

    let transporterConfig;

    if (process.env.EMAIL_HOST) {
        transporterConfig = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
        console.log(`Using Custom Host: ${process.env.EMAIL_HOST}`);
    } else {
        transporterConfig = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
        console.log("Using Default Gmail Service");
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("Connection Successful! Sending test mail...");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Layman Test Email",
            text: "If you see this, email sending is working!"
        });

        console.log("Message sent:", info.messageId);
        console.log("Email appears to be working correctly.");

    } catch (error) {
        console.error("------------------------------------------------");
        console.error("EMAIL TEST FAILED:");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Response:", error.response);
        console.error("------------------------------------------------");

        if (error.code === 'EAUTH') {
            console.log("HINT: check your EMAIL_USER and EMAIL_PASS. Make sure you are using an APP PASSWORD if using Gmail.");
        }
    }
}

testEmail();
