const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    console.log("--- DUMPING DB TO FILE ---");

    try {
        const allDest = await prisma.destination.findMany({
            take: 5
        });

        const dump = {
            count: allDest.length,
            items: allDest
        };

        fs.writeFileSync('db_dump.json', JSON.stringify(dump, null, 2));
        console.log("Dump written to db_dump.json");

    } catch (e) {
        console.error("DB Connection Failed:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
