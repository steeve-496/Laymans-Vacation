const prisma = require('./prismaClient');

async function checkSchema() {
    console.log("Checking Prisma Client...");
    try {
        // Just try to fetch an admin
        const admin = await prisma.admin.findFirst();
        console.log("Admin found:", admin);

        // Check if we can select email specifically to test if field is known
        const adminWithEmail = await prisma.admin.findFirst({
            select: { id: true, email: true }
        });
        console.log("Admin with email select:", adminWithEmail);

    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSchema();
