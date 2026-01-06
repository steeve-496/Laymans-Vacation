const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// V5 style datasources
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "mongodb+srv://adisonetheking_db_user:Steeve%4010201%24@cluster0.a04deeh.mongodb.net/layman?retryWrites=true&w=majority&appName=Cluster0"
        }
    }
});

async function main() {
    console.log("Seeding with Prisma 5...");
    try {
        await prisma.$connect();
        console.log("Connected!");

        const username = 'admin';
        const existing = await prisma.admin.findUnique({ where: { username } });
        if (!existing) {
            const hash = await bcrypt.hash('admin123', 10);
            await prisma.admin.create({
                data: { username, password: hash }
            });
            console.log("Admin created.");
        } else {
            console.log("Admin exists.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
