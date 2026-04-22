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
            context: 'contact',
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


// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
const getInquiries = async (req, res) => {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
    try {
        await prisma.inquiry.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete inquiry' });
    }
};

module.exports = {
    createInquiry,
    getInquiries,
    deleteInquiry
};

