const prisma = require('../prismaClient');

// @desc    Get Audit Logs
// @route   GET /api/audit
// @access  Private (Superadmin)
const getAuditLogs = async (req, res) => {
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                admin: {
                    select: { username: true, role: true }
                }
            }
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch logs" });
    }
};

// @desc    Clear Audit Logs
// @route   DELETE /api/audit
// @access  Private (Superadmin)
const clearAuditLogs = async (req, res) => {
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: "Not authorized. Superadmin access required." });
    }

    try {
        await prisma.auditLog.deleteMany({});
        res.json({ message: "Audit logs cleared" });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear logs" });
    }
};

module.exports = { getAuditLogs, clearAuditLogs };
