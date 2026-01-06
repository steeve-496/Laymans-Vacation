try {
    const pkg = require('dotenv/package.json');
    console.log('Dotenv version:', pkg.version);
} catch (e) {
    console.log('Dotenv check failed', e.message);
}

process.env.DATABASE_URL = "mongodb+srv://adisonetheking_db_user:Steeve%4010201%24@cluster0.a04deeh.mongodb.net/layman?retryWrites=true&w=majority&appName=Cluster0";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect().then(() => {
    console.log('Connected!');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
