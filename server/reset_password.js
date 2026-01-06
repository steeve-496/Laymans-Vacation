const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        console.log("Resetting password for 'steeve'...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await prisma.admin.update({
            where: { username: 'steeve' },
            data: { password: hashedPassword }
        });

        console.log("Password reset successful. Check:");

        const admin = await prisma.admin.findUnique({ where: { username: 'steeve' } });
        const isMatch = await bcrypt.compare('admin123', admin.password);
        console.log(`- steeve: Password 'admin123' match: ${isMatch}`);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
