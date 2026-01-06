const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const seed = async () => {
    try {
        console.log('Connecting to database...');
        // Try to connect explicitly
        await prisma.$connect();
        console.log('Connected successfully.');

        const username = 'admin';
        const password = 'admin123';

        // Check if admin exists
        const existing = await prisma.admin.findUnique({
            where: { username }
        });

        if (existing) {
            console.log('Admin user already exists.');
        } else {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await prisma.admin.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });
            console.log(`Admin user created. Username: ${username}, Password: ${password}`);
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();
