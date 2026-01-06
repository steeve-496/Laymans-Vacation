const axios = require('axios');

async function checkAdminAPI() {
    try {
        // Assuming no auth for this raw check or simulating it if possible.
        // Actually this route is protected. I can't easily curl it without a token.
        // I'll use the check_destinations.js script again but try to emulate the query.

        console.log("Checking DB directly for what the Admin API receives...");
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const content = await prisma.destination.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, isVisible: true, deletedAt: true }
        });

        console.log(`DB returns ${content.length} items for { deletedAt: null }`);
        if (content.length > 0) {
            console.log("Sample:", content[0]);
        }
        await prisma.$disconnect();

    } catch (e) {
        console.error(e);
    }
}

checkAdminAPI();
