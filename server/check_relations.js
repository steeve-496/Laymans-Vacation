const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const dests = await prisma.destination.findMany({ select: { id: true, name: true } });

    console.log("--- ID Mapping ---");
    const destMap = {};
    dests.forEach(d => {
        console.log(`${d.name}: ${d.id}`);
        destMap[d.id] = d.name;
    });

    console.log("\n--- Checking Package Links ---");
    const pkgs = await prisma.package.findMany({ select: { title: true, destinationId: true } });
    pkgs.forEach(p => {
        const parent = destMap[p.destinationId];
        if (!parent) console.log(`[ORPHAN] Package '${p.title}' linked to unknown ${p.destinationId}`);
        else console.log(`Package '${p.title}' -> ${parent}`);
    });

    console.log("\n--- Checking State Explorer Links ---");
    const ses = await prisma.stateExplorer.findMany({ select: { name: true, destinationId: true } });
    ses.forEach(s => {
        const parent = destMap[s.destinationId];
        if (!parent) console.log(`[ORPHAN] State '${s.name}' linked to unknown ${s.destinationId}`);
        else console.log(`State '${s.name}' -> ${parent}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
