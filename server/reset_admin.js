const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const updated = await prisma.admin.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
    });
    console.log(`Password for user 'admin' has been reset to 'password123'`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
