const { PrismaClient } = require('@prisma/client');

// Prisma 7 style?
const url = "mongodb+srv://adisonetheking_db_user:Steeve%4010201%24@cluster0.a04deeh.mongodb.net/layman?retryWrites=true&w=majority&appName=Cluster0";

const prisma = new PrismaClient({
    datasourceUrl: url
});

async function main() {
    console.log("Connecting with datasourceUrl...");
    try {
        await prisma.$connect();
        console.log("✅ CONNECTED!");
        const count = await prisma.admin.count();
        console.log(`Admins: ${count}`);
    } catch (e) {
        console.log("Failed with datasourceUrl");
        console.error(e);
    }
}

main();
