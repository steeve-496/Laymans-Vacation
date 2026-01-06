const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const states = await prisma.stateExplorer.findMany();
    console.log("States found:", states.length);
    console.log(JSON.stringify(states.slice(0, 5), null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
