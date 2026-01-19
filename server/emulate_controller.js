const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function testDestinations() {
    console.log("--- Testing Destinations ---");
    const dests = await prisma.destination.findMany({
        where: { deletedAt: null },
        orderBy: { order: 'asc' },
        include: { packages: true }
    });
    console.log(`Found ${dests.length} destinations.`);
    if (dests.length > 0) console.log("First dest:", dests[0].name);
}

async function testLogin() {
    console.log("\n--- Testing Login ---");
    const username = 'admin';
    const password = 'password123';

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
        console.log("Admin not found");
        return;
    }
    console.log("Admin found:", admin.username);
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(`Password match for '${password}': ${isMatch}`);
}

async function main() {
    await testDestinations();
    await testLogin();
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
