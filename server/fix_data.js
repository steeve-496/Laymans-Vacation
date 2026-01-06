const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log("--- FIXING DATA VISIBILITY ---");

    try {
        console.log("1. Resetting all DESTINATIONS...");
        const destUpdate = await prisma.destination.updateMany({
            data: {
                deletedAt: null,
                isVisible: true
            }
        });
        console.log(`   Updated ${destUpdate.count} destinations to be Visible & Active.`);

        console.log("2. Resetting all PACKAGES...");
        const pkgUpdate = await prisma.package.updateMany({
            data: {
                deletedAt: null
            }
        });
        console.log(`   Updated ${pkgUpdate.count} packages to be Active.`);

        console.log("--- DONE ---");

    } catch (e) {
        console.error("FATAL ERROR:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
