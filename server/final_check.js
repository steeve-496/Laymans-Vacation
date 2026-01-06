const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
    const dests = await prisma.destination.count({ where: { deletedAt: null } });
    const pkgs = await prisma.package.count({ where: { deletedAt: null } });
    const exps = await prisma.stateExplorer.count({ where: { deletedAt: null } });

    console.log("--- FINAL COUNTS ---");
    console.log(`Destinations: ${dests}`);
    console.log(`Packages: ${pkgs}`);
    console.log(`State Explorers: ${exps}`);

    if (exps === 0) console.error("CRITICAL: State Explorers still 0!");
}

checkCounts().finally(() => prisma.$disconnect());
