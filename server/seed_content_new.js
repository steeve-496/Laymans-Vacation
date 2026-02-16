const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
    {
        title: "Hidden Gems of Thailand: Beyond Bangkok",
        excerpt: "Discover the secret islands and ancient temples that most tourists miss. A journey through the soul of Siam.",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop",
        date: "Feb 10, 2026",
        category: "Destinations",
        author: "Sarah Jenkins",
        authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        content: `
            <p>Thailand is often synonymous with the bustling streets of Bangkok or the full moon parties of Koh Phangan. But beyond these well-trodden paths lies a kingdom of hidden wonders waiting to be explored.</p>
            
            <h3>The Ancient City of Sukhothai</h3>
            <p>While Ayutthaya gets all the fame, Sukhothai offers a more serene glimpse into Thailand's past. The historical park here is a UNESCO World Heritage site, best explored by bicycle at sunrise when the ancient Buddha statues are bathed in golden light.</p>

            <h3>Koh Kood: The Untouched Island</h3>
            <p>Far from the crowds of Phuket, Koh Kood remains one of Thailand's last unspoiled islands. With crystal clear waters, coconut palm-fringed beaches, and mesmerizing waterfalls, it's the perfect escape for those seeking tranquility.</p>

            <h3>Nan Province</h3>
            <p>Tucked away in Northern Thailand, Nan is a province of misty mountains and rice paddies. The local culture here is distinct, with influences from neighboring Laos. It's a hiker's paradise and a cultural treasure trove.</p>

            <p>Traveling to these hidden gems requires a bit more effort, but the authentic experiences and warm hospitality you'll encounter are well worth the journey.</p>
        `
    },
    {
        title: "A Culinary Journey Through Italy",
        excerpt: "From street food in Naples to fine dining in Milan. Why Italian cuisine is the heart of its culture.",
        image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop",
        date: "Feb 05, 2026",
        category: "Food & Culture",
        author: "Marco Rossi",
        authorImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
        content: `
            <p>Italy is a country where food is not just sustenance; it is a religion. Every region, every town, and every family has its own recipes passed down through generations.</p>

            <h3>Naples: The Birthplace of Pizza</h3>
            <p>No culinary journey in Italy is complete without visiting Naples. Here, pizza is unparalleled. The Margherita, with its simple ingredients of tomatoes, mozzarella, and basil, represents the colors of the Italian flag and the purity of Italian cooking.</p>

            <h3>Bologna: The Fat One</h3>
            <p>Known as 'La Grassa' (The Fat One), Bologna is the capital of Italian gastronomy. This is the home of ragù alla bolognese, mortadella, and tortellini. A walk through the Quadrilatero market will make any food lover's heart skip a beat.</p>

            <h3>Tuscany: Wine and Simple Pleasures</h3>
            <p>Tuscan cuisine is all about 'cucina povera' - making the most of simple, high-quality ingredients. Paired with a glass of Chianti, a simple dish of ribollita or pappa al pomodoro becomes a feast fit for a king.</p>
        `
    },
    {
        title: "Solo Travel: Finding Yourself in Bali",
        excerpt: "The ultimate guide to solo backpacking in Bali. Embracing freedom, nature, and inner peace.",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop",
        date: "Jan 28, 2026",
        category: "Solo Travel",
        author: "Emma Wilson",
        authorImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
        content: `
            <p>Bali has long been a magnet for solo travelers, and for good reason. It's a place where you can be alone without being lonely, surrounded by a culture that celebrates life and spirituality.</p>

            <h3>ubud: The Cultural Heart</h3>
            <p>Start your journey in Ubud, surrounded by rice terraces and rainforests. It's the perfect place for yoga, meditation, and connecting with other like-minded travelers. Don't miss the Monkey Forest and the traditional dance performances at the Royal Palace.</p>

            <h3>Canggu: Surf and Digital Nomads</h3>
            <p>If you're looking for a more social vibe, head to Canggu. It's the hub for digital nomads and surfers. The beach clubs here are legendary, and the food scene is incredible, offering everything from smoothie bowls to vegan tacos.</p>

            <h3>Nusa Penida</h3>
            <p>For a true adventure, take a boat to Nusa Penida. The dramatic cliffs of Kelingking Beach and the crystal-clear waters of Crystal Bay are breathtaking. It's a bit wilder than the mainland, offering a sense of true exploration.</p>
        `
    },
    {
        title: "Sustainable Tourism: Protecting Our Planet",
        excerpt: "How to be a responsible traveler. Tips on reducing your carbon footprint while exploring the world.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
        date: "Jan 15, 2026",
        category: "Eco Travel",
        author: "David Chen",
        authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        content: `
            <p>As travelers, we have a responsibility to protect the beautiful places we visit. Sustainable tourism isn't just a buzzword; it's a necessity for preserving our planet for future generations.</p>

            <h3>Reduce Plastic Waste</h3>
            <p>One of the easiest ways to make a difference is to say no to single-use plastics. Carry a reusable water bottle, a bamboo straw, and a tote bag. In many countries, plastic pollution is a major crisis.</p>

            <h3>Support Local Communities</h3>
            <p>Choose locally-owned hotels and restaurants over international chains. This ensures your money goes directly to the people who live there. Hire local guides who know the land and its history intimately.</p>

            <h3>Respect Wildlife</h3>
            <p>Never support attractions that exploit animals. Avoid riding elephants or taking photos with sedated tigers. Instead, observe wildlife in their natural habitat through ethical sanctuaries and national parks.</p>
        `
    },
    {
        title: "The Magic of Nordic Winters",
        excerpt: "Chasing the Northern Lights and cozying up in glass igloos. Experience the winter wonderland of Lapland.",
        image: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=1974&auto=format&fit=crop",
        date: "Dec 22, 2025",
        category: "Adventure",
        author: "Lars Jensen",
        authorImg: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
        content: `
            <p>Winter in the Nordics is a season of contrasts – long dark nights illuminated by the magical Northern Lights, and freezing temperatures warmed by cozy fires and saunas.</p>

            <h3>Chasing the Aurora</h3>
            <p>Seeing the Northern Lights is a bucket-list experience. The best places to see them are in the Arctic Circle – Tromsø in Norway, Abisko in Sweden, or Rovaniemi in Finland. Patience is key, but when they appear, it's pure magic.</p>

            <h3>Husky Sledding</h3>
            <p>There's no better way to explore the snowy wilderness than on a dog sled. The excitement of the huskies and the silence of the snow-covered forest create an unforgettable experience.</p>

            <h3>The Sauna Culture</h3>
            <p>In Finland, the sauna is a way of life. It's a place to relax, socialize, and cleanse. Braving a dip in an icy lake after a hot sauna is a rite of passage that leaves you feeling incredibly alive.</p>
        `
    },
    {
        title: "Backpacking South America: Route Guide",
        excerpt: "A comprehensive route planning guide for 3 months in South America. Budget tips and must-sees.",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop",
        date: "Nov 30, 2025",
        category: "Travel Guides",
        author: "Sofia Martinez",
        authorImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        content: `
            <p>South America is a continent of immense diversity, from the Amazon rainforest to the peaks of the Andes and the deserts of Atacama. Planning a trip here can be overwhelming, but rewarding.</p>

            <h3>The Gringo Trail</h3>
            <p>For first-timers, the classic route covers Peru, Bolivia, and Chile. Start in Lima, head to Cusco for Machu Picchu, cross Lake Titicaca into Bolivia for the Salt Flats, and end in the otherworldly landscapes of the Atacama Desert.</p>

            <h3>Patagonia</h3>
            <p>If you love hiking, Patagonia is a must. The W Trek in Torres del Paine and the Fitz Roy trek in El Chaltén offer some of the most spectacular scenery on Earth. Be prepared for unpredictable weather!</p>

            <h3>Colombia's Renaissance</h3>
            <p>Colombia has transformed into one of the most exciting destinations in the region. From the vibrant streets of Medellin to the colonial charm of Cartagena and the beaches of Tayrona National Park, it has something for everyone.</p>
        `
    }
];

const galleryItems = [
    {
        src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1368&auto=format&fit=crop",
        alt: "Beach Paradise",
        className: "large",
        caption: "Untouched Paradise"
    },
    {
        src: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?q=80&w=987&auto=format&fit=crop",
        alt: "Mountain Trek",
        className: "tall",
        caption: "Peak Adventures"
    },
    {
        src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=994&auto=format&fit=crop",
        alt: "City Lights",
        className: "",
        caption: "Urban Stories"
    },
    {
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop",
        alt: "Forest Trail",
        className: "",
        caption: "Nature's Path"
    },
    {
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop",
        alt: "Cultural Heritage",
        className: "wide",
        caption: "Timeless Culture"
    },
    {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop",
        alt: "Ocean View",
        className: "",
        caption: "Coastal Calm"
    },
    {
        src: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1170&auto=format&fit=crop",
        alt: "Thai Street",
        className: "tall",
        caption: "Vibrant Streets"
    },
    {
        src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=983&auto=format&fit=crop",
        alt: "Canals",
        className: "wide",
        caption: "Venetian Dreams"
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
    console.log(`Start seeding content...`);

    // Seed Blogs
    for (const post of blogPosts) {
        // Generate slug
        const slug = slugify(post.title);

        // Check duplication by slug ONLY
        const existing = await prisma.blog.findUnique({ where: { slug: slug } });
        if (!existing) {
            await prisma.blog.create({
                data: {
                    ...post,
                    slug: slug
                }
            });
            console.log(`Created blog: ${post.title}`);
        } else {
            console.log(`Skipped existing blog: ${post.title}`);
        }
    }

    // Seed Gallery
    const galleryCount = await prisma.galleryItem.count();
    if (galleryCount === 0) {
        for (let i = 0; i < galleryItems.length; i++) {
            const item = galleryItems[i];
            await prisma.galleryItem.create({
                data: {
                    ...item,
                    order: i
                }
            });
            console.log(`Created gallery item: ${item.caption}`);
        }
    } else {
        console.log(`Skipped gallery seeding (already has ${galleryCount} items)`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
