const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Updating Thailand...");
    // We use updateMany to avoid needing unique ID if name is unique
    // Or just update.
    const dest = await prisma.destination.findFirst({ where: { name: 'Thailand' } });
    if (dest) {
        await prisma.destination.update({
            where: { id: dest.id },
            data: { deletedAt: null }
        });
        console.log("Thailand updated to have explicit deletedAt: null");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
