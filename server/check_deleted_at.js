const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allDestinations = await prisma.destination.findMany({
        select: { name: true, deletedAt: true, isVisible: true }
    });
    console.log("All Destinations:", JSON.stringify(allDestinations, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
