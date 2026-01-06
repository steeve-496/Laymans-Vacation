console.log('Node works');
try {
    require('dotenv').config();
    console.log('Dotenv loaded');
    console.log('DB URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'Missing');
} catch (e) { console.error('Dotenv failed', e); }

try {
    const { PrismaClient } = require('@prisma/client');
    console.log('Prisma imported');
    const prisma = new PrismaClient();
    console.log('Prisma instantiated');
} catch (e) { console.error('Prisma failed', e); }
