const { PrismaClient } = require('@prisma/client');
const prisma = require('./prismaClient');

async function check() {
    try {
        const dest = await prisma.destination.findUnique({
            where: { name: "Dubai" }
        });
        console.log("Check Dubai:", dest);
        if (dest && dest.lat !== undefined) {
            console.log("✅ Coordinates found! Lat:", dest.lat);
        } else {
            console.log("❌ Coordinates MISSING.");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
check();
