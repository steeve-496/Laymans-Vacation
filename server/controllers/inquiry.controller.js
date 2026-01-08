const prisma = require('../prismaClient');
const sendEmail = require('../services/email.service');

// @desc    Create a new inquiry from contact form
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
    const { name, email, phone, adults, children, travelDate, packageTitle } = req.body;

    try {
        // 1. Save to Database
        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                phone,
                adults: parseInt(adults),
                children: parseInt(children || 0),
                travelDate: new Date(travelDate),
                packageTitle
            }
        });

        // 2. Prepare Email Notification
        const emailOptions = {
            email: process.env.EMAIL_USER, // Send to site owner/admin
            subject: `New Trip Inquiry: ${packageTitle}`,
            message: `
                You have a new trip inquiry from Layman's Vacation website.

                Trip Details:
                - Package: ${packageTitle}
                - Travel Date: ${new Date(travelDate).toDateString()}

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
            await sendEmail(emailOptions);
            console.log(`Inquiry email sent for: ${email}`);
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

module.exports = {
    createInquiry
};
