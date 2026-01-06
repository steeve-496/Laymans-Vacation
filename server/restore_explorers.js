const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restoreStateExplorers() {
    try {
        console.log("Checking State Explorer deletion status...");

        const total = await prisma.stateExplorer.count();
        const active = await prisma.stateExplorer.count({ where: { deletedAt: null } });
        const deleted = await prisma.stateExplorer.count({ where: { NOT: { deletedAt: null } } });

        console.log(`Total: ${total}, Active: ${active}, Deleted: ${deleted}`);

        if (deleted > 0) {
            console.log("Restoring all state explorers...");
            const updateResult = await prisma.stateExplorer.updateMany({
                where: { NOT: { deletedAt: null } },
                data: { deletedAt: null }
            });
            console.log(`Restored ${updateResult.count} state explorers.`);
        } else {
            console.log("No state explorers to restore.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

restoreStateExplorers();
