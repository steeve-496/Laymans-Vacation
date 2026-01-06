const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    // For now, we use a placeholder or check env.
    // Ideally, the user should provide valid credentials.

    // We'll log the email to console if no credentials are present (Dev mode).
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("----------------------------------------------------");
        console.log("WARNING: Email credentials not found in .env");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("----------------------------------------------------");
        // We resolve successfully effectively mocking it for dev
        return;
    }

    // Sanitize and trim environment variables
    const emailUser = (process.env.EMAIL_USER || '').trim();
    const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, ''); // Remove all spaces
    const emailHost = (process.env.EMAIL_HOST || '').trim();
    const emailPort = parseInt((process.env.EMAIL_PORT || '587').toString().trim());
    const emailSecure = (process.env.EMAIL_SECURE || '').toString().trim() === 'true';

    console.log("----- [Email Service Debug Config] -----");
    console.log(`Using Custom SMTP: ${!!process.env.EMAIL_HOST}`);
    if (process.env.EMAIL_HOST) {
        console.log(`Host: '${emailHost}'`);
        console.log(`Port: ${emailPort}`);
        console.log(`Secure: ${emailSecure}`);
        console.log(`User: '${emailUser}'`);
    } else {
        console.log(`Service: Gmail (Default)`);
        console.log(`User: '${emailUser}'`);
    }
    console.log(`Password Present: ${!!emailPass}`);
    console.log(`Password Length: ${emailPass.length}`);
    console.log("----------------------------------------");


    if (process.env.EMAIL_HOST) {
        // Custom SMTP
        transporterConfig = {
            host: emailHost,
            port: emailPort,
            secure: emailSecure,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        };
    } else {
        // Default to Gmail
        transporterConfig = {
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        };
    }

    const transporter = nodemailer.createTransport({
        ...transporterConfig,
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Layman Support'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error("Nodemailer Send Error:", error);
        // Fallback for dev/debug: Log content so admin can manually reset if email fails
        console.log("---------------- [Email Failed - Manual Fallback] ----------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("------------------------------------------------------------------");
        throw error; // Re-throw to let controller know it failed
    }
};

module.exports = sendEmail;
