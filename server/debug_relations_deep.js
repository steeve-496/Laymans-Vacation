const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Deep Debugging Relations ---");

    // Fetch all destinations
    const destinations = await prisma.destination.findMany({
        where: { deletedAt: null }
    });

    console.log(`\nActive Destinations: ${destinations.length}`);
    const destMap = {};
    destinations.forEach(d => {
        console.log(`[DEST] ID: ${d.id} (Type: ${typeof d.id}) | Name: "${d.name}"`);
        destMap[d.id] = d.name;
    });

    // Fetch all packages
    const packages = await prisma.package.findMany({
        where: { deletedAt: null }
    });
    console.log(`\nActive Packages: ${packages.length}`);

    packages.forEach(p => {
        const dName = destMap[p.destinationId] || "UNKNOWN";
        console.log(`[PKG] ID: ${p.id} | DestID: ${p.destinationId} (Type: ${typeof p.destinationId}) -> Matches: ${dName}`);

        if (dName === "UNKNOWN") {
            console.log("   --> WARNING: ORPHAN PACKAGE");
        }
    });

    // Fetch State Explorers
    const explorers = await prisma.stateExplorer.findMany({
        where: { deletedAt: null }
    });
    console.log(`\nActive State Explorers: ${explorers.length}`);

    explorers.forEach(e => {
        const dName = destMap[e.destinationId] || "UNKNOWN";
        console.log(`[EXP] ID: ${e.id} | DestID: ${e.destinationId} (Type: ${typeof e.destinationId}) -> Matches: ${dName}`);
        if (dName === "UNKNOWN") {
            console.log("   --> WARNING: ORPHAN EXPLORER");
        }
    });

}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
