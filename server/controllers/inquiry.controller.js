const prisma = require('../prismaClient');
const sendEmail = require('../services/email.service');

// @desc    Create a new inquiry from contact form
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
    const { name, email, phone, adults, children, travelDate, packageTitle, message } = req.body;

    try {
        // 1. Save to Database
        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                phone,
                adults: parseInt(adults),
                children: parseInt(children || 0),
                travelDate: travelDate ? new Date(travelDate) : new Date(), // Allow optional date
                packageTitle: packageTitle || "General Inquiry",
                message
            }
        });

        // 2. Prepare Email Notification
        const emailOptions = {
            email: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // Send to site owner/admin
            subject: `New Inquiry: ${packageTitle || "General Contact"}`,
            message: `
                You have a new inquiry from Layman's Vacation website.

                Inquiry Details:
                - Type: ${packageTitle || "General Contact"}
                - Message: ${message || "N/A"}
                - Travel Date: ${travelDate ? new Date(travelDate).toDateString() : "Not specified"}

                Customer Details:
                - Name: ${name}
                - Email: ${email}
                - Phone: ${phone}
                - Group Size: ${adults} Adults, ${children || 0} Children

                Submitted on: ${new Date().toLocaleString()}
            `
        };

        // 3. Send Email (non-blocking for response)
        try {
            // await sendEmail(emailOptions);
            await sendEmail(emailOptions);
        } catch (mailError) {
            console.error("Failed to send inquiry email notification:", mailError);
            // We don't fail the request if email fails, as DB record is saved
        }

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            data: inquiry
        });

    } catch (error) {
        console.error("Error creating inquiry:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Test Email Configuration (Debug)
// @route   GET /api/inquiries/test-email
// @access  Public (Temporary)
const testEmailConfig = async (req, res) => {
    const configStatus = {
        ENV_CONTACT_EMAIL: process.env.CONTACT_EMAIL ? 'Set' : 'MISSING',
        ENV_EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'MISSING',
        ENV_EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'MISSING',
        ENV_RESEND_KEY: process.env.RESEND_API_KEY ? 'Set' : 'MISSING'
    };

    try {
        const testOptions = {
            email: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
            subject: 'Layman Production Email Test',
            message: `This is a test email to verify production email configuration.\n\nConfig Check:\n${JSON.stringify(configStatus, null, 2)}`
        };

        if (!testOptions.email) {
            throw new Error("Target email (CONTACT_EMAIL or EMAIL_USER) is missing.");
        }

        await sendEmail(testOptions);

        res.status(200).json({
            success: true,
            message: 'Test email sent successfully. Check your inbox (and spam).',
            config: configStatus
        });
    } catch (error) {
        console.error("Test Email Failed:", error);
        res.status(500).json({
            success: false,
            message: 'Test email failed.',
            error: error.message,
            config: configStatus,
            stack: error.stack
        });
    }
};

module.exports = {
    createInquiry,
    testEmailConfig
};
