const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
    console.log("Diagnosing Bhutan...");
    const bhutan = await prisma.destination.findFirst({ where: { name: 'Bhutan' } });

    if (!bhutan) {
        console.log("Bhutan destination NOT FOUND.");
        return;
    }

    console.log(`Bhutan ID: ${bhutan.id} | DeletedAt: ${bhutan.deletedAt}`);

    // Check explorers for Bhutan
    const explorers = await prisma.stateExplorer.findMany({
        where: { destinationId: bhutan.id },
    });

    console.log(`Found ${explorers.length} explorers for Bhutan (Total, including deleted).`);

    explorers.forEach(e => {
        console.log(`- ${e.name}: deletedAt = ${e.deletedAt}`);
    });

    const active = explorers.filter(e => !e.deletedAt).length;
    console.log(`Active explorers: ${active}`);

}

diagnose().finally(() => prisma.$disconnect());
