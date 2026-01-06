const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log("--- DEBUGGING DATABASE STATE ---");

    try {
        // Destinations
        const totalDest = await prisma.destination.count();
        const activeDest = await prisma.destination.count({ where: { deletedAt: null } });
        const trashDest = await prisma.destination.count({ where: { deletedAt: { not: null } } });
        console.log(`DESTINATIONS: Total=${totalDest}, Active=${activeDest}, Trash=${trashDest}`);

        // Packages
        const totalPkg = await prisma.package.count();
        const activePkg = await prisma.package.count({ where: { deletedAt: null } });
        const trashPkg = await prisma.package.count({ where: { deletedAt: { not: null } } });
        console.log(`PACKAGES: Total=${totalPkg}, Active=${activePkg}, Trash=${trashPkg}`);

        console.log("--- RAW ITEM DUMP (Top 3 Trashed Destinations) ---");
        const sampleTrash = await prisma.destination.findMany({
            where: { deletedAt: { not: null } },
            take: 3,
            select: { id: true, name: true, deletedAt: true }
        });
        console.log(JSON.stringify(sampleTrash, null, 2));

    } catch (e) {
        console.error("DB Connection Failed:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
