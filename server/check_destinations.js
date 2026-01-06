const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allDestinations = await prisma.destination.findMany();
    console.log(`Total Destinations in DB: ${allDestinations.length}`);
    allDestinations.forEach(d => {
        console.log(`- ID: ${d.id}, Name: ${d.name}, Visible: ${d.isVisible}, DeletedAt: ${d.deletedAt}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
