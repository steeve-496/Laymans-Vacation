const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.admin.findMany({ select: { username: true, email: true } });
    if (admins.length === 0) {
        console.log("No admins found.");
        // Create default admin
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const newAdmin = await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                email: 'admin@example.com',
                role: 'superadmin'
            }
        });
        console.log("Created default admin: admin / password123");
    } else {
        console.log("Found admins:", admins);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
