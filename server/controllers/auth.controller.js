const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide both username and password' });
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (admin && isMatch) {
            const token = generateToken(admin.id);

            // Set Cookie
            // For production with cross-site (Render backend + Vercel/Local frontend), we need SameSite='None' and Secure=true
            // CAUTION: Secure=true requires HTTPS. 
            // If testing on localhost (HTTP) against Remote (HTTPS), Secure=true MIGHT work on localhost but usually requires HTTPS.
            // Chrome treats localhost as secure context.
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Required for SameSite: 'None'
                sameSite: 'none', // Required for cross-site
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.json({
                id: admin.id,
                username: admin.username,
                role: admin.role,
                token: token, // Send token to client for mobile compatibility
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout Admin / Clear Cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get Current Admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.json(req.admin);
};

// @desc    Create Initial Admin (Seed helper, remove/protect in prod)
// @route   POST /api/auth/seed
// @access  Public (should be protected or removed after use)
const seedAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    // Check if any admin exists
    const existing = await prisma.admin.findFirst();
    if (existing) return res.status(403).json({ message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await prisma.admin.create({
        data: {
            username,
            password: hashedPassword
        }
    });

    res.status(201).json({ id: admin.id, username: admin.username });
}

// @desc    Register new Admin (Protected)
// @route   POST /api/auth/register
// @access  Private (Superadmin only)
const createAdmin = async (req, res) => {
    // Check Superadmin
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    const { username, password, role } = req.body;

    if (!username || !password || username.trim() === '') {
        return res.status(400).json({ message: 'Please add all fields (username cannot be empty)' });
    }

    try {
        const adminExists = await prisma.admin.findUnique({
            where: { username },
        });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                role: role || 'admin',
                email: req.body.email || null
            },
        });

        if (admin) {
            res.status(201).json({
                id: admin.id,
                username: admin.username,
                role: admin.role,
                message: "New admin created successfully"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all admins
// @route   GET /api/auth/list
// @access  Private (Superadmin only)
const getAdmins = async (req, res) => {
    // Check Superadmin
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, username: true, role: true, email: true }
        });
        // We don't verify password here
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update Admin (Role or Password)
// @route   PUT /api/auth/update/:id
// @access  Private (Superadmin only)
const updateAdmin = async (req, res) => {
    // Check Superadmin
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    const { role, password, username, email } = req.body;
    try {
        const data = {};
        if (role) data.role = role;

        if (username) {
            // Check if username is taken by another admin
            const existing = await prisma.admin.findUnique({ where: { username } });
            if (existing && existing.id !== req.params.id) {
                return res.status(400).json({ message: "Username already taken" });
            }
            data.username = username;
        }

        if (email) {
            // Check if email is taken?
            // Assuming email is optional but if provided should be unique usually?
            // Schema has email @unique. So we must check.
            const existingEmail = await prisma.admin.findUnique({ where: { email } });
            if (existingEmail && existingEmail.id !== req.params.id) {
                return res.status(400).json({ message: "Email already in use" });
            }
            data.email = email;
        }

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(password, salt);
        }

        const admin = await prisma.admin.update({
            where: { id: req.params.id },
            data,
            select: { id: true, username: true, role: true, email: true }
        });
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Update failed" });
    }
}

// @desc    Delete Admin
// @route   DELETE /api/auth/delete/:id
// @access  Private (Superadmin only)
const deleteAdmin = async (req, res) => {
    // Check Superadmin
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    try {
        // Prevent deleting self
        if (req.admin.id === req.params.id) {
            return res.status(400).json({ message: "Cannot delete yourself" });
        }

        const adminId = req.params.id;

        // Manually cascade delete audit logs
        await prisma.auditLog.deleteMany({
            where: { adminId: adminId }
        });

        await prisma.admin.delete({
            where: { id: adminId }
        });
        res.json({ message: "Admin and associated audit logs removed" });
    } catch (error) {
        console.error("Delete Admin Error:", error);
        res.status(500).json({ message: error.message || "Delete failed" });
    }
}

const sendEmail = require('../services/email.service');
const crypto = require('crypto'); // Built-in node module for random bytes

// ... (Existing functions)

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { username } = req.body;

    try {
        const admin = await prisma.admin.findUnique({
            where: { username }
        });

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        // Restrict to Superadmin
        if (admin.role !== 'superadmin') {
            return res.status(403).json({ message: "Not authorized. Only Superadmins can reset passwords." });
        }

        if (!admin.email) {
            return res.status(400).json({ message: "No email linked to this account. Contact support." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before saving (security)
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Set expiry (10 minutes)
        const expire = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                resetOtp: hashedOtp,
                resetOtpExpire: expire
            }
        });

        const message = `Your password reset code is: ${otp}\n\nThis code expires in 10 minutes.`;

        try {
            await sendEmail({
                email: admin.email,
                subject: 'Layman Admin Password Reset',
                message
            });
            res.json({ message: "Email sent" });
        } catch (emailError) {
            console.error("Email send failed:", emailError);
            // Rollback OTP? Or just let it sit.
            res.status(500).json({ message: "Email send failed (Timeout or Auth Error). Check server logs." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Reset Password (Verify OTP)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { username, otp, newPassword } = req.body;

    try {
        const admin = await prisma.admin.findUnique({
            where: { username }
        });

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!admin.resetOtp || !admin.resetOtpExpire) {
            return res.status(400).json({ message: "Invalid request" });
        }

        if (new Date() > admin.resetOtpExpire) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, admin.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                resetOtp: null,
                resetOtpExpire: null
            }
        });

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    getMe,
    seedAdmin,
    createAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    forgotPassword,
    resetPassword
};
