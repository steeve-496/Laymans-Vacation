// Set Env Var BEFORE importing Prisma
process.env.DATABASE_URL = "mongodb+srv://adisonetheking_db_user:Steeve%4010201%24@cluster0.a04deeh.mongodb.net/layman?retryWrites=true&w=majority&appName=Cluster0";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Attempting to connect to MongoDB...");
    try {
        await prisma.$connect();
        console.log("✅ CONNECTION SUCCESSFUL!");

        const count = await prisma.admin.count();
        console.log(`Found ${count} admins.`);

        // If 0, create one
        if (count === 0) {
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash('admin123', 10);
            await prisma.admin.create({
                data: { username: 'admin', password: hash }
            });
            console.log("Created admin user.");
        }

    } catch (e) {
        console.error("❌ CONNECTION FAILED");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
