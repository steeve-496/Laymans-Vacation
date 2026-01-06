const prisma = require('../prismaClient');

const logAction = async (adminId, action, details = null) => {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                details: details ? JSON.stringify(details) : null
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
};

module.exports = { logAction };
