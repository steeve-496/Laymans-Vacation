const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.admin.findMany();
    console.log("Found admins:", admins.length);
    admins.forEach(a => {
        console.log(`- Username: ${a.username}, Role: ${a.role}, PasswordHash: ${a.password.substring(0, 10)}...`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
