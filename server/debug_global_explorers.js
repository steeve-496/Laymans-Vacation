const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAll() {
    console.log("--- Global Active Explorer List ---");
    const active = await prisma.stateExplorer.findMany({
        where: { deletedAt: null },
        include: { destination: true } // Include dest to see name
    });

    console.log(`Total Active: ${active.length}`);
    active.forEach((e, i) => {
        const dName = e.destination ? e.destination.name : "ORPHAN";
        console.log(`${i + 1}. [${dName}] - ${e.name} (ID: ${e.id})`);
    });

    // Check Bhutan specifically
    const bhutan = await prisma.destination.findFirst({ where: { name: 'Bhutan' } });
    if (bhutan) {
        const bExps = await prisma.stateExplorer.findMany({ where: { destinationId: bhutan.id } });
        console.log(`\nBhutan (ID: ${bhutan.id}) Total Raw Explorers: ${bExps.length}`);
        bExps.forEach(e => {
            console.log(`- ${e.name}: deletedAt is ${e.deletedAt}`);
        });
    }
}

listAll().finally(() => prisma.$disconnect());
