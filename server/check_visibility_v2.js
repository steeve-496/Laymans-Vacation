const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Destinations ---");
    const dests = await prisma.destination.findMany({ select: { name: true, isVisible: true, isInternational: true, deletedAt: true } });
    console.log(dests);

    console.log("\n--- Packages ---");
    // Package/StateExplorer do not have isVisible
    const pkgs = await prisma.package.findMany({ select: { title: true, deletedAt: true, destinationId: true } });
    console.log(`Found ${pkgs.length} packages`);
    if (pkgs.length > 0) console.log(pkgs.slice(0, 3));

    console.log("\n--- State Explorers ---");
    const ses = await prisma.stateExplorer.findMany({ select: { name: true, deletedAt: true, destinationId: true } });
    console.log(`Found ${ses.length} state explorers`);
    if (ses.length > 0) console.log(ses.slice(0, 3));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
