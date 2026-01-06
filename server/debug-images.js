const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
    const packages = await prisma.package.findMany({
        take: 10,
        include: { destination: true }
    });

    console.log("Checking first 10 packages:");
    packages.forEach(p => {
        console.log(`Package: ${p.title} | Dest: ${p.destination?.name} | Cat: ${p.category} | Image: ${p.image}`);
    });
    await prisma.$disconnect();
}

checkImages();
