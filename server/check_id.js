const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const id = '695c8fffc42580756ed32e02';
    let output = `Checking for ID: ${id}\n`;

    try {
        const directFetch = await prisma.destination.findUnique({ where: { id } });
        output += "Direct Fetch: " + JSON.stringify(directFetch, null, 2) + "\n";

        if (directFetch) {
            output += `DeletedAt Value: ${directFetch.deletedAt}\n`;
            output += `Is DeletedAt Null? ${directFetch.deletedAt === null}\n`;
        }

        const allActive = await prisma.destination.findMany({ where: { deletedAt: null } });
        output += `Total Active Destinations: ${allActive.length}\n`;

        const found = allActive.find(d => d.id === id);
        output += `Found in Active List: ${!!found}\n`;
    } catch (e) {
        output += "Error: " + e.message + "\n";
    }

    fs.writeFileSync('check_result.txt', output);
}

main();
