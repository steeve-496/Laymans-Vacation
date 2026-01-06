const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking relations...");

    // Get all destinations
    const destinations = await prisma.destination.findMany({
        where: { deletedAt: null },
        include: { packages: true, stateExplorers: true }
    });

    console.log(`Found ${destinations.length} active destinations.`);

    // Check specifically for ones that might have no packages but should
    destinations.forEach(d => {
        console.log(`[${d.id}] ${d.name}: ${d.packages.length} packages, ${d.stateExplorers.length} state explorers.`);
    });

}

main();
