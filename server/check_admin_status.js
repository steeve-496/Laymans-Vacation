const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function checkAdmin() {
    try {
        console.log("Checking admin users...");
        const admins = await prisma.admin.findMany();
        console.log(`Found ${admins.length} admins.`);

        for (const admin of admins) {
            console.log(`- ${admin.username} (${admin.role}) - ID: ${admin.id}`);
            // Check if password 'admin123' works (just verifying hash, not logging in)
            const isMatch = await bcrypt.compare('admin123', admin.password);
            console.log(`  Password 'admin123' match: ${isMatch}`);
        }

        if (admins.length === 0) {
            console.log("NO ADMIN USERS FOUND! creating fallback...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await prisma.admin.create({
                data: {
                    username: 'superadmin',
                    password: hashedPassword,
                    role: 'superadmin'
                }
            });
            console.log("Created fallback superadmin (admin123)");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
