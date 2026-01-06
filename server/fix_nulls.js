const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing deletedAt fields...");

    // Update where deletedAt is missing (if possible via Prisma) or just update all active ones.
    // Easier to just update all where deletedAt is currently 'undefined' logic?
    // Prisma treats undefined as 'do nothing'.
    // We want to force set null for everything that IS NOT set.

    // Find all.
    const all = await prisma.destination.findMany();
    console.log(`Checking ${all.length} destinations.`);

    let fixed = 0;
    for (const d of all) {
        // In JS, d.deletedAt might be null if it's missing in DB?
        // Let's force update it to null if it's falsy.
        if (!d.deletedAt) {
            await prisma.destination.update({
                where: { id: d.id },
                data: { deletedAt: null }
            });
            fixed++;
        }
    }
    console.log(`Fixed ${fixed} records.`);
}

main();
