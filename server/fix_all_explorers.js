const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAll() {
    console.log("Forcing deletedAt: null on ALL State Explorers...");

    const res = await prisma.stateExplorer.updateMany({
        data: { deletedAt: null }
    });

    console.log(`Updated ${res.count} records.`);

    // Check count again
    const count = await prisma.stateExplorer.count({ where: { deletedAt: null } });
    console.log(`Total Active Now: ${count}`);
}

fixAll().finally(() => prisma.$disconnect());
