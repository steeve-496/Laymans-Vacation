const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Ensure we use the hardcoded client or the one with env
const prisma = require('./prismaClient');

async function reset() {
    try {
        console.log("Resetting admin password...");
        await prisma.$connect();

        const username = 'admin';
        const newPassword = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await prisma.admin.findUnique({ where: { username } });

        if (user) {
            console.log(`Found user '${user.username}'. ID: ${user.id}`);
            await prisma.admin.update({
                where: { username },
                data: { password: hashedPassword }
            });
            console.log("✅ Password updated to: admin123");
        } else {
            console.log("❌ User 'admin' not found. Creating it...");
            await prisma.admin.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });
            console.log("✅ User 'admin' created with password: admin123");
        }

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

reset();
