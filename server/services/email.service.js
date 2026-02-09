const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const sendEmail = async (options) => {
    // 1. PRIMARY METHOD: RESEND (Recommended for Production)
    /*
    if (process.env.RESEND_API_KEY) {
        try {
            console.log(`----- [Email Service] Sending via Resend API to: ${options.email} -----`);

            const resend = new Resend(process.env.RESEND_API_KEY);
            const data = await resend.emails.send({
                from: 'Layman\'s <onboarding@resend.dev>', // Default testing domain. User can verify their own later.
                to: options.email,
                subject: options.subject,
                text: options.message,
            });

            if (data.error) {
                console.error("Resend API Error:", data.error);
                throw new Error(data.error.message);
            }

            console.log('Resend Success ID:', data.id);
            return; // Success! Exit early.
        } catch (error) {
            console.error("Resend Failed. Falling back to Nodemailer...", error);
            // Don't return, let it fall through to Nodemailer as backup
        }
    }
    */

    // 2. SECONDARY METHOD: NODEMAILER (Legacy/SMTP)
    // Sanitize and trim environment variables
    const emailUser = (process.env.EMAIL_USER || '').trim();
    const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, ''); // Remove all spaces
    const emailHost = (process.env.EMAIL_HOST || '').trim();
    const emailPort = parseInt((process.env.EMAIL_PORT || '587').toString().trim());
    const emailSecure = (process.env.EMAIL_SECURE || '').toString().trim() === 'true';

    let transporterConfig;
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
        // Default to Gmail with explicit settings
        transporterConfig = {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
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
        from: `${process.env.FROM_NAME || 'Layman\'s Support'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        console.error(`Attempting to send email via Nodemailer to ${options.email}`);
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error("Nodemailer Send Error:", error);
        console.log("---------------- [Email Failed - Manual Fallback] ----------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("------------------------------------------------------------------");
        throw error; // Re-throw to let controller know it failed
    }
};

module.exports = sendEmail;
