const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Hardcoded connection string for debugging
const connectionString = "mongodb+srv://adisonetheking_db_user:Steeve%4010201%24@cluster0.a04deeh.mongodb.net/layman?retryWrites=true&w=majority&appName=Cluster0";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
});

const seed = async () => {
    try {
        console.log('Connecting...');
        await prisma.$connect();
        console.log('Connected!');

        const username = 'admin';
        const password = 'admin123';

        const existing = await prisma.admin.findUnique({ where: { username } });
        if (existing) {
            console.log('Admin already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await prisma.admin.create({
                data: { username, password: hashedPassword }
            });
            console.log(`Admin created: ${username} / ${password}`);
        }
    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();
