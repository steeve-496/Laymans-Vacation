const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const destCount = await prisma.destination.count();
    const pkgCount = await prisma.package.count();
    const seCount = await prisma.stateExplorer.count();

    console.log(`Destinations: ${destCount}`);
    console.log(`Packages: ${pkgCount}`);
    console.log(`StateExplorers: ${seCount}`);

    const dests = await prisma.destination.findMany({ select: { name: true, isVisible: true } });
    console.log('Destinations:', dests);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
