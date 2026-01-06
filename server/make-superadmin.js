const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the user 'admin' or the first user
    const admin = await prisma.admin.findFirst({
        where: { username: 'admin' }
    });

    if (admin) {
        console.log(`Found admin user: ${admin.username}`);
        await prisma.admin.update({
            where: { id: admin.id },
            data: { role: 'superadmin' }
        });
        console.log(`Successfully upgraded '${admin.username}' to superadmin.`);
    } else {
        // Fallback: upgrade the very first user found
        const firstUser = await prisma.admin.findFirst();
        if (firstUser) {
            console.log(`User 'admin' not found. Upgrading first user '${firstUser.username}' instead.`);
            await prisma.admin.update({
                where: { id: firstUser.id },
                data: { role: 'superadmin' }
            });
            console.log(`Successfully upgraded '${firstUser.username}' to superadmin.`);
        } else {
            console.log("No users found to upgrade.");
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
