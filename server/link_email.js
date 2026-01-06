const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkEmail() {
    console.log("Linking email to 'steeve'...");

    // We assume the user wants to test this.
    // I will set a placeholder email or ask user?
    // User said: "linking an account with mail id"
    // I made it optional.

    // Attempt to update 'steeve'
    const admin = await prisma.admin.findUnique({ where: { username: 'steeve' } });

    if (!admin) {
        console.log("Admin 'steeve' not found!");
        return;
    }

    // Set a dummy email for dev if not provided? 
    // Or just let user edit it via API?
    // I will set it to a dummy for now so they can see it working via console logs.
    const email = 'admin@layman.com';

    try {
        await prisma.admin.update({
            where: { id: admin.id },
            data: { email: email }
        });
        console.log(`Success! Linked '${email}' to user 'steeve'.`);
        console.log("You can now test Forgot Password. OTP will be logged in server console if SMTP is not configured.");
    } catch (e) {
        console.error("Failed to link email:", e.message);
        console.log("NOTE: This might fail if the schema update hasn't been applied (requires server restart/db push).");
    }
}

linkEmail().finally(() => prisma.$disconnect());
