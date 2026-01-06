const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyData() {
    console.log("Verifying Data Consistency...");

    try {
        const explorerEntries = await prisma.stateExplorer.findMany();
        const destinations = await prisma.destination.findMany();

        console.log(`Found ${explorerEntries.length} Explorer Entries.`);
        console.log(`Found ${destinations.length} Destinations.`);

        const destNames = destinations.map(d => d.name);

        console.log("\n--- Checking Explorer Entries vs Destinations ---");
        let mismatchCount = 0;

        explorerEntries.forEach(entry => {
            if (!destNames.includes(entry.name)) {
                console.log(`❌ Mismatch: Explorer Entry "${entry.name}" does NOT match any Destination name.`);
                mismatchCount++;
            } else {
                console.log(`✅ Match: "${entry.name}" linked correctly.`);
            }
        });

        if (mismatchCount > 0) {
            console.log(`\nFound ${mismatchCount} mismatches using Name.`);
        } else {
            console.log("\nAll Explorer entries match a Destination name!");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyData();
