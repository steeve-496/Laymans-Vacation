const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const explorers = [
    {
        destinationName: "Azerbaijan",
        items: [
            {
                name: "Baku",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/baku.jpg",
                description: "The capital city, a mix of ancient and modern architecture.",
                order: 1
            },
            {
                name: "Gabala",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/gabala.jpg",
                description: "Known for its beautiful mountains and nature reserves.",
                order: 2
            },
            {
                name: "Sheki",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/sheki.jpg",
                description: "A historic city on the Silk Road with the Khan's Palace.",
                order: 3
            }
        ]
    },
    {
        destinationName: "Bali",
        items: [
            {
                name: "Ubud",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/bali-ubud.jpg",
                description: "Cultural heart of Bali, known for rice terraces and temples.",
                order: 1
            },
            {
                name: "Kuta & Seminyak",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/bali-kuta.jpg",
                description: "Famous for vibrant nightlife, shopping, and sunsets.",
                order: 2
            },
            {
                name: "Nusa Penida",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/bali-nusa.jpg",
                description: "Stunning island getaway with dinosaur-shaped cliffs.",
                order: 3
            }
        ]
    },
    // Add other destinations if needed, keeping it simple to solve the immediate "0 items" issue for testing.
    {
        destinationName: "Dubai",
        items: [
            {
                name: "Downtown Dubai",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/dubai-downtown.jpg", // Placeholder
                description: "Home to Burj Khalifa and Dubai Mall.",
                order: 1
            },
            {
                name: "The Palm Jumeirah",
                image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/dubai-palm.jpg", // Placeholder
                description: "Artificial archipelago known for glitzy hotels.",
                order: 2
            }
        ]
    }
];

async function seedExplorers() {
    console.log("Seeding State Explorers...");

    // Get all destinations to map IDs
    const destinations = await prisma.destination.findMany();
    const destMap = {};
    destinations.forEach(d => destMap[d.name] = d.id);

    let count = 0;

    for (const group of explorers) {
        const destId = destMap[group.destinationName];
        if (!destId) {
            console.log(`Skipping ${group.destinationName} - Destination not found`);
            continue;
        }

        for (const item of group.items) {
            await prisma.stateExplorer.create({
                data: {
                    name: item.name,
                    image: item.image,
                    description: item.description,
                    order: item.order,
                    destinationId: destId,
                    deletedAt: null
                }
            });
            count++;
        }
    }
    console.log(`Seeded ${count} state explorers.`);
}

seedExplorers()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
