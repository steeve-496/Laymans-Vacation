const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyImages() {
    console.log("Verifying Package Images...");
    try {
        const packages = await prisma.package.findMany({
            include: { destination: true }
        });

        if (packages.length === 0) {
            console.log("No packages found.");
            return;
        }

        console.log(`Found ${packages.length} packages.`);

        packages.forEach(pkg => {
            console.log(`Package: "${pkg.title}" (Dest: ${pkg.destination?.name})`);
            console.log(`   Image: ${pkg.image ? `"${pkg.image}"` : "NULL/UNDEFINED"}`);
            // Check if it's a cloudinary URL or local
            if (pkg.image && !pkg.image.startsWith('http')) {
                console.log(`   Note: Local path detected.`);
            }
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyImages();
