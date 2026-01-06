const { PrismaClient } = require('@prisma/client');
const prisma = require('./prismaClient'); // Use our configured client

const international = [
    {
        name: "Azerbaijan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Azerbaijan.webp",
        lat: 40.1431,
        lng: 47.5769,
        description: "Known as the Land of Fire, blending ancient history with modern futuristic architecture.",
        isInternational: true
    },
    {
        name: "Bali",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bali.webp",
        lat: -8.7892,
        lng: 115.2162,
        description: "A tropical paradise famed for its stunning beaches, spirituality, and vibrant culture.",
        isInternational: true
    },
    {
        name: "Bhutan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bhutan.webp",
        lat: 27.4667,
        lng: 90.4667,
        description: "The Last Shangri-La, offering breathtaking Himalayan landscapes and rich Buddhist heritage.",
        isInternational: true
    },
    {
        name: "Dubai",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Dubai.webp",
        lat: 25.2044,
        lng: 55.2714,
        description: "A city of superlatives with towering skyscrapers, luxury shopping, and desert adventures.",
        badge: "Best Seller",
        isInternational: true
    },
    {
        name: "Kazakhstan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Kazakhstan.webp",
        lat: 43.2467,
        lng: 66.9667,
        description: "The heart of Central Asia, featuring vast steppes, mountains, and modern cities.",
        isInternational: true
    },
    {
        name: "Malaysia",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Malaysia.webp",
        lat: 3.1390,
        lng: 101.6937,
        description: "A melting pot of cultures with iconic towers, rainforests, and beautiful islands.",
        isInternational: true
    },
    {
        name: "Singapore",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655249/Singapore_gvfyn6.jpg",
        lat: 1.3521,
        lng: 103.8198,
        description: "A futuristic city-state known for its cleanliness, green spaces, and diverse food scene.",
        isInternational: true
    },
    {
        name: "Sri Lanka",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Sri%20Lanka.webp",
        lat: 6.9315,
        lng: 79.8667,
        description: "The Pearl of the Indian Ocean, rich in history, wildlife, and golden sandy beaches.",
        isInternational: true
    },
    {
        name: "Thailand",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png",
        lat: 13.7563,
        lng: 100.5018,
        description: "The Land of Smiles, famous for its temples, street food, and tropical islands.",
        badge: "Best Seller",
        isInternational: true
    },
    {
        name: "Vietnam",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655268/Vietnam_qgebdl.png",
        lat: 10.8236,
        lng: 106.6290,
        description: "A country of staggering natural beauty and cultural complexities.",
        isInternational: true
    },
];

const domestic = [
    {
        name: "Munnar",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp",
        lat: 10.0889,
        lng: 77.0595,
        description: "Rolling tea gardens and misty hills make this a perfect honey-moon destination.",
        isInternational: false
    },
    {
        name: "Wayanad",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/wayanad.webp",
        lat: 11.6854,
        lng: 76.1320,
        description: "A green paradise with waterfalls, caves, and exotic wildlife in Kerala.",
        isInternational: false
    },
    {
        name: "Varkala",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/varkala.webp",
        lat: 8.7379,
        lng: 76.7163,
        description: "Famous for its stunning cliff-side beaches and relaxed coastal vibe.",
        isInternational: false
    },
    {
        name: "Alleppey",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/kerala.webp",
        lat: 9.4981,
        lng: 76.3388,
        description: "The Venice of the East, renowned for its tranquil backwaters and houseboats.",
        isInternational: false
    },
];

const getPackages = (location) => [
    {
        category: "Basic",
        navTitle: "The Glimpse",
        title: `Best of ${location}`,
        price: "Rs 25,000",
        duration: "5 Days",
        description: "Experience the highlights and hidden gems in this curated tour.",
        itinerary: [
            { day: 1, title: "Arrival & Welcome", description: "Arrive at the destination and transfer to your hotel. Enjoy a welcome dinner with local cuisine." },
            { day: 2, title: "City Tour", description: "Guided tour of the city's most iconic landmarks, including historical sites and vibrant markets." },
            { day: 3, title: "Cultural Immersion", description: "Visit local villages, interact with artisans, and learn about traditional crafts." },
            { day: 4, title: "Nature Walk", description: "Explore the surrounding nature trails and enjoy a picnic lunch with scenic views." },
            { day: 5, title: "Departure", description: "Free time for last-minute shopping before transferring to the airport for your flight home." }
        ]
    },
    {
        category: "Getaway",
        navTitle: "The Escape",
        title: `Romantic ${location}`,
        price: "Rs 80,000",
        duration: "6 Days",
        description: "Perfect for couples. Sunsets, private dinners, and beautiful views.",
        itinerary: [
            { day: 1, title: "Romantic Arrival", description: "Private transfer to the hotel. Champagne welcome and sunset dinner on the beach." },
            { day: 2, title: "Private Island Tour", description: "Exclusive boat tour to secluded islands. Snorkeling and private beach picnic." },
            { day: 3, title: "Spa Day", description: "Indulge in a couples' spa treatment followed by a relaxing afternoon by the infinity pool." },
            { day: 4, title: "Sunset Cruise", description: "Evening yacht cruise with cocktails and watching the sun dip below the horizon." },
            { day: 5, title: "Candlelit Dinner", description: "A special 5-course dinner under the stars at a renowned cliffside restaurant." },
            { day: 6, title: "Farewell", description: "Breakfast in bed and private transfer to the airport." }
        ]
    },
    {
        category: "Adventure",
        navTitle: "The Voyage",
        title: `${location} Adventure`,
        price: "Rs 1,00,000",
        duration: "8 Days",
        description: "For the thrill-seekers. Hiking, rafting, and exploring the wild.",
        itinerary: [
            { day: 1, title: "Base Camp Arrival", description: "Arrive at base camp, meet your guides, and gear up for the adventure ahead." },
            { day: 2, title: "Mountain Trekking", description: "Full-day trek through rugged terrain, reaching high-altitude viewpoints." },
            { day: 3, title: "White Water Rafting", description: "Adrenaline-pumping rafting experience on the river rapids." },
            { day: 4, title: "Jungle Safari", description: "Jeep safari through the national park to spot wildlife in their natural habitat." },
            { day: 5, title: "Rock Climbing", description: "Guided rock climbing session suitable for all skill levels." },
            { day: 6, title: "Camping Under Stars", description: "Overnight camping in the wilderness with a bonfire and storytelling." },
            { day: 7, title: "Zip Lining", description: "Soar through the canopy on a zip line course." },
            { day: 8, title: "Departure", description: "Return to civilization and transfer to the airport." }
        ]
    },
    {
        category: "Luxury",
        navTitle: "The Odyssey",
        title: `Luxury ${location}`,
        price: "Rs 2,50,000",
        duration: "10 Days",
        description: "Indulge in the finest accommodations and exclusive experiences.",
        itinerary: [
            { day: 1, title: "VIP Arrival", description: "Helicopter transfer to your 5-star hotel. Personal butler service and welcome amenities." },
            { day: 2, title: "Private City Tour", description: "Chauffeur-driven tour of the city's highlights with a private historian guide." },
            { day: 3, title: "Wine Tasting", description: "Exclusive visit to a top vineyard for a private tasting and gourmet lunch." },
            { day: 4, title: "Yacht Charter", description: "Full-day private yacht charter with onboard chef and water sports." },
            { day: 5, title: "Michelin Star Dining", description: "Dinner at a 3-Michelin star restaurant with a curated tasting menu." },
            { day: 6, title: "Cultural Gala", description: "VIP seats at a traditional cultural performance or opera." },
            { day: 7, title: "Wellness Retreat", description: "Full day of holistic wellness treatments and yoga sessions." },
            { day: 8, title: "Shopping Spree", description: "Personal shopper experience at luxury boutiques." },
            { day: 9, title: "Farewell Banquet", description: "Grand farewell banquet in a private ballroom." },
            { day: 10, title: "Departure", description: "Limousine transfer to the airport for your first-class flight." }
        ]
    }
];

const countryData = {
    "Azerbaijan": [
        { name: "Baku", description: "The City of Winds, blending ancient history with modern futuristic architecture.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Azerbaijan.webp" },
        { name: "Gabala", description: "Nature's Paradise with stunning mountain views and adventure activities.", image: "https://images.unsplash.com/photo-1588369281132-55b5f37e6818?w=600&auto=format&fit=crop&q=60" },
        { name: "Sheki", description: "Ancient Silk Road city with historic palaces and traditional crafts.", image: "https://images.unsplash.com/photo-1590588875980-dc6f453e57c9?w=600&auto=format&fit=crop&q=60" },
    ],
    "Bali": [
        { name: "Ubud", description: "Cultural heart of Bali with temples, rice terraces and art galleries.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bali.webp" },
        { name: "Kuta", description: "Famous for stunning sunsets, surf beaches and vibrant nightlife.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
        { name: "Nusa Penida", description: "Island escape with dramatic cliffs, pristine beaches and crystal waters.", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Bhutan": [
        { name: "Thimphu", description: "Capital city blending tradition with modernity, home to dzongs and markets.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bhutan.webp" },
        { name: "Paro", description: "Gateway to Tiger's Nest monastery with stunning Himalayan landscapes.", image: "https://images.unsplash.com/photo-1638245771029-9bdb1e3e7a01?w=600&auto=format&fit=crop&q=60" },
        { name: "Punakha", description: "Winter capital featuring the majestic Punakha Dzong and river valleys.", image: "https://images.unsplash.com/photo-1586347347212-429e14d79f83?w=600&auto=format&fit=crop&q=60" },
    ],
    "Dubai": [
        { name: "Burj Khalifa", description: "Touch the sky at the world's tallest building with panoramic city views.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Dubai.webp" },
        { name: "Palm Jumeirah", description: "Iconic man-made island with luxury resorts and stunning architecture.", image: "https://images.pexels.com/photos/8319454/pexels-photo-8319454.jpeg" },
        { name: "Desert Safari", description: "Golden dunes adventure with camel rides, BBQ dinner and entertainment.", image: "https://images.pexels.com/photos/936250/pexels-photo-936250.jpeg" },
    ],
    "Munnar": [
        { name: "Hills & Wildlife", description: "Includes Eravikulam National Park, Mattupetty Dam and sunset points.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp" },
        { name: "Tea Trail Escape", description: "Perfect short break with tea gardens, waterfalls and local sightseeing.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp" },
    ],
    "Wayanad": [
        { name: "Wayanad Nature Break", description: "Caves, dams and forest viewpoints with relaxed pacing.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/wayanad.webp" },
    ],
    "Varkala": [
        { name: "Cliff & Cafe Getaway", description: "Beach time, cliff walk, cafes and sunset viewpoints.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/varkala.webp" },
    ],
    "Alleppey": [
        { name: "Houseboat Classic", description: "Overnight houseboat stay with meals and sunset cruise.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/kerala.webp" },
    ],
    "Kazakhstan": [
        { name: "Almaty", description: "City of Apples surrounded by snow-capped mountains and modern culture.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Kazakhstan.webp" },
        { name: "Astana", description: "Modern marvel capital with futuristic architecture and landmarks.", image: "https://images.pexels.com/photos/2475746/pexels-photo-2475746.jpeg" },
        { name: "Charyn Canyon", description: "Valley of Castles with stunning red rock formations.", image: "https://images.pexels.com/photos/28359695/pexels-photo-28359695.jpeg" },
    ],
    "Malaysia": [
        { name: "Kuala Lumpur", description: "Iconic Petronas Twin Towers, diverse culture and amazing street food.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Malaysia.webp" },
        { name: "Langkawi", description: "Jewel of Kedah with pristine beaches, cable car and duty-free shopping.", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop" },
        { name: "Penang", description: "Pearl of the Orient with heritage streets, temples and local cuisine.", image: "https://images.pexels.com/photos/34401/pexels-photo.jpg" },
    ],
    "Singapore": [
        { name: "Marina Bay", description: "Iconic skyline with Marina Bay Sands, Merlion and waterfront dining.", image: "https://images.pexels.com/photos/3914755/pexels-photo-3914755.jpeg" },
        { name: "Sentosa", description: "State of Fun with Universal Studios, beaches and adventure parks.", image: "https://images.pexels.com/photos/11527373/pexels-photo-11527373.jpeg" },
        { name: "Gardens by Bay", description: "Supertree Grove, Cloud Forest and Flower Dome attractions.", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Sri Lanka": [
        { name: "Colombo", description: "Ocean city with colonial heritage, markets and modern attractions.", image: "https://images.pexels.com/photos/2239999/pexels-photo-2239999.jpeg" },
        { name: "Kandy", description: "Hill capital with Temple of the Tooth and scenic lake.", image: "https://images.pexels.com/photos/32678292/pexels-photo-32678292.jpeg" },
        { name: "Ella", description: "Mountain views, Nine Arches Bridge and tea plantation trails.", image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Sri%20Lanka.webp" },
    ],
    "Thailand": [
        { name: "Bangkok", description: "City of Angels with grand palaces, temples and vibrant street life.", image: "https://images.pexels.com/photos/3121347/pexels-photo-3121347.jpeg" },
        { name: "Phuket", description: "Pearl of Andaman with beautiful beaches, islands and water sports.", image: "https://images.pexels.com/photos/2554603/pexels-photo-2554603.jpeg" },
        { name: "Chiang Mai", description: "Rose of the North with ancient temples and elephant sanctuaries.", image: "https://images.pexels.com/photos/2956618/pexels-photo-2956618.jpeg" },
    ],
    "Vietnam": [
        { name: "Hanoi", description: "City of Peace with ancient temples, French colonial architecture.", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/61/62/de/chua-m-t-c-t-one-pillar.jpg?h=500&s=1&w=900" },
        { name: "Ha Long Bay", description: "Descending Dragon bay with limestone karsts and emerald waters.", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop" },
        { name: "Da Nang", description: "Coastal charm with beautiful beaches and marble mountains.", image: "https://images.pexels.com/photos/28297412/pexels-photo-28297412.jpeg" },
    ]
};


async function seedContent() {
    try {
        console.log("Seeding Content...");
        await prisma.$connect();

        // Optional: clear existing if you want a fresh start
        // await prisma.package.deleteMany({});
        // await prisma.stateExplorer.deleteMany({});
        // await prisma.destination.deleteMany({});

        // Combine all destinations
        const allDestinations = [...international, ...domestic];

        for (const destData of allDestinations) {
            console.log(`Processing ${destData.name}...`);

            // 1. Create/Update Destination
            const destination = await prisma.destination.upsert({
                where: { name: destData.name }, // Assuming name is unique
                update: {
                    ...destData,
                    details: {} // Placeholder if you have specific details structure
                },
                create: {
                    ...destData,
                    details: {}
                }
            });

            // 2. Create Packages for this Destination
            const packages = getPackages(destData.name);
            for (const pkg of packages) {
                // Upsert package based on composite unique key if possible, 
                // but since we don't have one, we'll try to find by title+destinationId or just create
                const existingPkg = await prisma.package.findFirst({
                    where: {
                        destinationId: destination.id,
                        title: pkg.title
                    }
                });

                if (existingPkg) {
                    await prisma.package.update({
                        where: { id: existingPkg.id },
                        data: {
                            title: pkg.title,
                            navTitle: pkg.navTitle,
                            category: pkg.category,
                            price: pkg.price,
                            duration: pkg.duration,
                            description: pkg.description,
                            image: destData.image,
                            details: {
                                itinerary: pkg.itinerary
                            }
                        }
                    });
                } else {
                    await prisma.package.create({
                        data: {
                            title: pkg.title,
                            navTitle: pkg.navTitle,
                            category: pkg.category,
                            price: pkg.price,
                            duration: pkg.duration,
                            description: pkg.description,
                            image: destData.image,
                            destinationId: destination.id,
                            details: {
                                itinerary: pkg.itinerary
                            }
                        }
                    });
                }
            }

            // 3. Create State Explorers for this Destination (if it acts as a "country")
            if (countryData[destData.name]) {
                const states = countryData[destData.name];
                for (const state of states) {
                    const existingState = await prisma.stateExplorer.findFirst({
                        where: {
                            destinationId: destination.id,
                            name: state.name
                        }
                    });

                    if (existingState) {
                        await prisma.stateExplorer.update({
                            where: { id: existingState.id },
                            data: state
                        });
                    } else {
                        await prisma.stateExplorer.create({
                            data: {
                                ...state,
                                destinationId: destination.id
                            }
                        });
                    }
                }
            }
        }

        console.log("✅ Content Seeded Successfully!");

    } catch (e) {
        console.error("❌ Content Seed Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seedContent();
