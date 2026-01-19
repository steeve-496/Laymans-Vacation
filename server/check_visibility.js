const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Destinations ---");
    const dests = await prisma.destination.findMany({ select: { name: true, isVisible: true, deletedAt: true } });
    console.log(dests.slice(0, 3)); // Show first 3

    console.log("\n--- Packages ---");
    const pkgs = await prisma.package.findMany({ select: { title: true, isVisible: true, deletedAt: true } });
    if (pkgs.length > 0) console.log(pkgs.slice(0, 3));
    else console.log("No packages found");

    console.log("\n--- State Explorers ---");
    const ses = await prisma.stateExplorer.findMany({ select: { name: true, isVisible: true, deletedAt: true } });
    if (ses.length > 0) console.log(ses.slice(0, 3));
    else console.log("No state explorers found");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
