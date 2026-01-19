const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Destinations...");
    // Find all that probably need fixing (or just update all to be safe)
    const dests = await prisma.destination.findMany({ select: { id: true } });
    for (const d of dests) {
        await prisma.destination.update({
            where: { id: d.id },
            data: { deletedAt: null }
        });
    }
    console.log(`Fixed ${dests.length} destinations.`);

    console.log("Fixing Packages...");
    const pkgs = await prisma.package.findMany({ select: { id: true } });
    for (const p of pkgs) {
        await prisma.package.update({
            where: { id: p.id },
            data: { deletedAt: null }
        });
    }
    console.log(`Fixed ${pkgs.length} packages.`);

    console.log("Fixing StateExplorers...");
    const ses = await prisma.stateExplorer.findMany({ select: { id: true } });
    for (const s of ses) {
        await prisma.stateExplorer.update({
            where: { id: s.id },
            data: { deletedAt: null }
        });
    }
    console.log(`Fixed ${ses.length} state explorers.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
