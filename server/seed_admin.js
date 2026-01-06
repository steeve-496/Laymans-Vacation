const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("--- SEEDING ADMIN USER ---");

    const username = "admin";
    const password = "admin123";

    try {
        // Check if admin exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { username }
        });

        if (existingAdmin) {
            console.log("Admin user already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin.update({
                where: { username },
                data: { password: hashedPassword }
            });
            console.log("Admin password updated to 'admin123'.");
        } else {
            console.log("Creating new Admin user...");
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: 'admin'
                }
            });
            console.log("Admin user created successfully.");
        }

    } catch (e) {
        console.error("Error seeding admin:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
