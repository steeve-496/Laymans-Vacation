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
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 30px; border-radius: 10px; border: 1px solid #e1e8ed;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #2c3e50; margin: 0; font-size: 24px; letter-spacing: 0.5px;">New Inquiry Received</h2>
                    <p style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">Layman's Vacation</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="color: #e67e22; border-bottom: 2px solid #f0f3f4; padding-bottom: 10px; margin-top: 0; font-size: 18px;">Inquiry Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #555; width: 35%;"><strong>Type:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #2c3e50; font-weight: 500;">${packageTitle || "General Contact"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #555;"><strong>Travel Date:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #2c3e50; font-weight: 500;">${travelDate ? new Date(travelDate).toDateString() : "Not specified"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #555;" valign="top"><strong>Message:</strong></td>
                            <td style="padding: 10px 0; color: #2c3e50; line-height: 1.5; font-style: italic;">"${message || "N/A"}"</td>
                        </tr>
                    </table>

                    <h3 style="color: #e67e22; border-bottom: 2px solid #f0f3f4; padding-bottom: 10px; font-size: 18px;">Customer Details</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #555; width: 35%;"><strong>Name:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #2c3e50; font-weight: 500;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #555;"><strong>Email:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4;"><a href="mailto:${email}" style="color: #3498db; text-decoration: none; font-weight: 500;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #555;"><strong>Phone:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f4; color: #2c3e50; font-weight: 500;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #555;"><strong>Group Size:</strong></td>
                            <td style="padding: 10px 0; color: #2c3e50; font-weight: 500;">${adults} Adults, ${children || 0} Children</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 25px; color: #95a5a6; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 5px 0;">Submitted on: ${new Date().toLocaleString()}</p>
                    <p style="margin: 5px 0;">© Layman's Vacation. All rights reserved.</p>
                </div>
            </div>
        `;

        const emailOptions = {
            email: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // Send to site owner/admin
            subject: `New Inquiry: ${packageTitle || "General Contact"}`,
            context: 'contact',
            message: `New Inquiry from Layman's Vacation. Name: ${name}, Email: ${email}, Phone: ${phone}, Message: ${message}`, // Plain text fallback
            html: emailHtml
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

