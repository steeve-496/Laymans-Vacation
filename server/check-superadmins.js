const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const superadmins = await prisma.admin.findMany({
        where: { role: 'superadmin' },
        select: { username: true, role: true }
    });

    console.log("Current Superadmins:");
    console.table(superadmins);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
