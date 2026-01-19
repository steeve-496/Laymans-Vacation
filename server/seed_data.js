const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const destinations = [
    { name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },
    { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
    { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1546708773-e57fa527ac1d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
    { name: 'China', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bhutan', image: 'https://images.unsplash.com/photo-1621935263625-780c1097654b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cambodia', image: 'https://images.unsplash.com/photo-1565063073722-e3668c072229?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' }
];

const packages = [
    {
        title: 'PHUKET & KRABI – 4N / 5D COMPLETE EXPERIENCE',
        destination: 'Thailand',
        duration: '4 Nights / 5 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
        category: 'Best Seller',
        details: {
            itineraryDestinations: 'Phuket (2 Nights) + Krabi (2 Nights)',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Phuket',
                    activities: [
                        'Arrival at Phuket International Airport',
                        'Meet & greet by local representative',
                        'Transfer to hotel and check-in',
                        'Evening free for leisure or Patong Beach / Bangla Road exploration',
                        'Overnight stay in Phuket'
                    ],
                    stay: 'Phuket'
                },
                {
                    day: 2,
                    title: 'Phuket City Tour + Simon Cabaret Show',
                    activities: [
                        'Breakfast at hotel',
                        'Phuket City Tour covering:',
                        '  - Big Buddha',
                        '  - Wat Chalong Temple',
                        '  - Old Phuket Town (Sino-Portuguese architecture & street markets)',
                        '  - Promthep Cape (scenic viewpoint)',
                        'Evening Simon Cabaret Show – Famous transgender cabaret performance',
                        'Return to hotel',
                        'Overnight stay in Phuket'
                    ],
                    meals: 'Breakfast',
                    stay: 'Phuket'
                },
                {
                    day: 3,
                    title: 'Phuket – James Bond Island Tour + Krabi Transfer',
                    activities: [
                        'Early breakfast at hotel',
                        'Full-day James Bond Island Tour (Phang Nga Bay) by speed boat or longtail boat:',
                        '  - Canoeing / kayaking in limestone caves and lagoons',
                        '  - Photo stops at iconic James Bond Island (Khao Phing Kan)',
                        '  - Koh Panyee fishing village visit',
                        'Lunch included on tour',
                        'Return to Phuket & transfer to Krabi (3–4 hours)',
                        'Check-in at hotel',
                        'Evening free',
                        'Overnight stay in Krabi'
                    ],
                    meals: 'Breakfast, Lunch',
                    stay: 'Krabi'
                },
                {
                    day: 4,
                    title: 'Krabi 4 Islands Tour',
                    activities: [
                        'Breakfast at hotel',
                        'Full-day Krabi 4 Islands Tour:',
                        '  - Phra Nang Cave Beach',
                        '  - Chicken Island',
                        '  - Tup Island',
                        '  - Poda Island',
                        '  - Snorkeling & swimming opportunities',
                        'Return to hotel',
                        'Evening free for leisure or local market shopping',
                        'Overnight stay in Krabi'
                    ],
                    meals: 'Breakfast',
                    stay: 'Krabi'
                },
                {
                    day: 5,
                    title: 'Departure – Krabi',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to Krabi Airport for onward journey',
                        'Tour ends with memorable experiences'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'MALAYSIA ESSENTIALS – 3N / 4D',
        destination: 'Malaysia',
        duration: '3 Nights / 4 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
        category: 'Best Seller',
        details: {
            itineraryDestinations: 'Kuala Lumpur',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Kuala Lumpur',
                    activities: [
                        'Arrival at Kuala Lumpur International Airport (KLIA)',
                        'Meet & greet by local representative',
                        'Transfer to hotel',
                        'Check-in & relax',
                        'Evening free for shopping at Bukit Bintang / Jalan Alor',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 2,
                    title: 'Kuala Lumpur City Tour',
                    activities: [
                        'Breakfast at hotel',
                        'Half-day Kuala Lumpur City Tour covering:',
                        '  - Petronas Twin Towers (Photo stop)',
                        '  - King’s Palace (Istana Negara)',
                        '  - National Mosque',
                        '  - Independence Square',
                        '  - Batu Caves',
                        'Afternoon free for shopping',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    meals: 'Breakfast',
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 3,
                    title: 'Genting Highlands with Cable Car',
                    activities: [
                        'Breakfast at hotel',
                        'Proceed to Genting Highlands',
                        'Enjoy two-way cable car ride',
                        'Free time at Sky Avenue / Outdoor Theme Park (subject to availability)',
                        'Return to Kuala Lumpur',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    meals: 'Breakfast',
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 4,
                    title: 'Departure – Kuala Lumpur',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to KLIA Airport for onward journey',
                        'Tour ends with pleasant memories'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'MALAYSIA & LANGKAWI – 6 NIGHTS / 7 DAYS',
        destination: 'Malaysia',
        duration: '6 Nights / 7 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1549420084-2a6c1170d55e?auto=format&fit=crop&w=800&q=80',
        category: 'Luxury',
        details: {
            itineraryDestinations: 'Kuala Lumpur (3N) + Langkawi (3N)',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Kuala Lumpur',
                    activities: [
                        'Arrival at Kuala Lumpur International Airport (KLIA)',
                        'Meet & greet by local representative',
                        'Transfer to hotel and check-in',
                        'Evening free for shopping at Bukit Bintang / Jalan Alor',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 2,
                    title: 'Kuala Lumpur City Tour + KL Bird Park',
                    activities: [
                        'Breakfast at hotel',
                        'Half-day Kuala Lumpur City Tour, covering:',
                        '  - Petronas Twin Towers (Photo stop)',
                        '  - King’s Palace (Istana Negara)',
                        '  - National Mosque',
                        '  - Independence Square',
                        '  - Batu Caves',
                        'Visit KL Bird Park – world’s largest free-flight aviary',
                        'Return to hotel',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    meals: 'Breakfast',
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 3,
                    title: 'Genting Highlands + Putrajaya + Aquaria KLCC',
                    activities: [
                        'Breakfast at hotel',
                        'Full-day excursion:',
                        '  - Genting Highlands – Cable car ride & Sky Avenue',
                        '  - Putrajaya City Tour – Putra Mosque, Perdana Putra, Putrajaya Square',
                        '  - Visit Aquaria KLCC',
                        'Return to hotel',
                        'Overnight stay in Kuala Lumpur'
                    ],
                    meals: 'Breakfast',
                    stay: 'Kuala Lumpur'
                },
                {
                    day: 4,
                    title: 'Kuala Lumpur – Langkawi',
                    activities: [
                        'Breakfast & check-out',
                        'Transfer to airport for flight to Langkawi (flight not included)',
                        'Arrival & transfer to hotel',
                        'Evening free at leisure on the beach',
                        'Overnight stay in Langkawi'
                    ],
                    meals: 'Breakfast',
                    stay: 'Langkawi'
                },
                {
                    day: 5,
                    title: 'Langkawi Island Hopping + Eagle Square + Kuah Town',
                    activities: [
                        'Breakfast at hotel',
                        'Half-day Island Hopping Tour:',
                        '  - Pulau Dayang Bunting (Pregnant Maiden Lake)',
                        '  - Pulau Singa Besar (Eagle Feeding)',
                        '  - Pulau Beras Basah (Beach & swimming)',
                        'Visit Eagle Square (Dataran Lang)',
                        'Explore Kuah Town – Duty-free shopping',
                        'Evening free or optional Sunset Dinner Cruise',
                        'Overnight stay in Langkawi'
                    ],
                    meals: 'Breakfast',
                    stay: 'Langkawi'
                },
                {
                    day: 6,
                    title: 'Langkawi Cable Car + Sky Bridge + Kilim Mangrove Tour + Tanjung Rhu',
                    activities: [
                        'Breakfast at hotel',
                        'Langkawi Cable Car & Sky Bridge – Stunning aerial views',
                        'Explore Seven Wells Waterfall (Telaga Tujuh)',
                        'Kilim Karst Geoforest Park & Mangrove Tour',
                        '  - Mangrove forests, limestone caves, bat & crocodile caves',
                        'Visit Tanjung Rhu Beach – Scenic & peaceful',
                        'Return to hotel',
                        'Overnight stay in Langkawi'
                    ],
                    meals: 'Breakfast',
                    stay: 'Langkawi'
                },
                {
                    day: 7,
                    title: 'Departure – Langkawi',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to Langkawi Airport for onward journey',
                        'Tour ends with wonderful memories'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'SINGAPORE COMPLETE EXPERIENCE – 4N / 5D',
        destination: 'Singapore',
        duration: '4 Nights / 5 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
        category: 'Best Seller',
        details: {
            itineraryDestinations: 'Singapore',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Singapore',
                    activities: [
                        'Arrival at Singapore Changi Airport',
                        'Meet & greet by local representative',
                        'Transfer to hotel and check-in',
                        'Evening free for leisure or explore Marina Bay / Merlion Park',
                        'Overnight stay in Singapore'
                    ],
                    stay: 'Singapore'
                },
                {
                    day: 2,
                    title: 'Singapore City Tour + Gardens by the Bay',
                    activities: [
                        'Breakfast at hotel',
                        'Half-day Singapore City Tour covering:',
                        '  - Merlion Park – Iconic Singapore landmark',
                        '  - Marina Bay Sands / Esplanade Theatre – Photo stop',
                        '  - Little India – Cultural heritage experience',
                        '  - Chinatown – Street shopping & temples',
                        '  - Orchard Road – Shopping / photo stop',
                        'Afternoon visit Gardens by the Bay:',
                        '  - Flower Dome & Cloud Forest',
                        '  - Supertree Grove & OCBC Skyway',
                        'Return to hotel',
                        'Overnight stay in Singapore'
                    ],
                    meals: 'Breakfast',
                    stay: 'Singapore'
                },
                {
                    day: 3,
                    title: 'Sentosa Island + Universal Studios Singapore',
                    activities: [
                        'Breakfast at hotel',
                        'Full-day Sentosa Island Tour:',
                        '  - Universal Studios Singapore – Rides, shows & themed zones',
                        '  - S.E.A Aquarium (optional)',
                        '  - Wings of Time show (evening)',
                        '  - Beach & leisure time',
                        'Return to hotel',
                        'Overnight stay in Singapore'
                    ],
                    meals: 'Breakfast',
                    stay: 'Singapore'
                },
                {
                    day: 4,
                    title: 'Jurong Bird Park + Night Safari',
                    activities: [
                        'Breakfast at hotel',
                        'Morning visit Jurong Bird Park – World-class free-flight aviary',
                        'Afternoon free for shopping or leisure',
                        'Evening Singapore Night Safari – Unique nocturnal wildlife experience',
                        'Return to hotel',
                        'Overnight stay in Singapore'
                    ],
                    meals: 'Breakfast',
                    stay: 'Singapore'
                },
                {
                    day: 5,
                    title: 'Departure – Singapore',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to Changi Airport for onward journey',
                        'Tour ends with unforgettable Singapore memories'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'MALDIVES ROMANTIC ESCAPE – 3N / 4D',
        destination: 'Maldives',
        duration: '3 Nights / 4 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        category: 'Honeymoon',
        details: {
            itineraryDestinations: 'Maldives (Male / Resort Island)',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Maldives',
                    activities: [
                        'Arrival at Velana International Airport (Male)',
                        'Meet & greet by representative',
                        'Speedboat / Seaplane transfer to the resort',
                        'Check-in and welcome drink',
                        'Relax at the resort, enjoy the beach or private villa',
                        'Evening at leisure',
                        'Overnight stay at Maldives resort'
                    ],
                    stay: 'Maldives'
                },
                {
                    day: 2,
                    title: 'Water Activities & Island Leisure',
                    activities: [
                        'Breakfast at the resort',
                        'Day at leisure to enjoy resort facilities',
                        'Optional activities:',
                        '  - Snorkeling',
                        '  - Scuba Diving',
                        '  - Jet Ski / Parasailing',
                        '  - Dolphin Watching Cruise',
                        'Sunset beach walk or private dinner (optional)',
                        'Overnight stay at Maldives resort'
                    ],
                    meals: 'Breakfast',
                    stay: 'Maldives'
                },
                {
                    day: 3,
                    title: 'Full-Day Excursion / Relaxation',
                    activities: [
                        'Breakfast at the resort',
                        'Full-day optional Island Hopping Excursion:',
                        '  - Visit local islands',
                        '  - Picnic on uninhabited islands',
                        '  - Snorkeling & swimming',
                        'Evening leisure at resort',
                        'Optional Romantic Candlelight Dinner',
                        'Overnight stay at Maldives resort'
                    ],
                    meals: 'Breakfast',
                    stay: 'Maldives'
                },
                {
                    day: 4,
                    title: 'Departure – Maldives',
                    activities: [
                        'Breakfast at the resort',
                        'Check-out and transfer to Velana International Airport via speedboat / seaplane',
                        'Departure with unforgettable Maldives memories'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'SRI LANKA HIGHLIGHTS – 6N / 7D',
        destination: 'Sri Lanka',
        duration: '6 Nights / 7 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1546708773-e57fa527ac1d?auto=format&fit=crop&w=800&q=80',
        category: 'Adventure',
        details: {
            itineraryDestinations: 'Colombo -> Bentota -> Galle -> Kandy -> Nuwara Eliya',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Colombo',
                    activities: [
                        'Arrival at Bandaranaike International Airport, Colombo',
                        'Meet & greet by local representative',
                        'Transfer to hotel in Colombo',
                        'Evening at leisure / explore Galle Face Green or local markets',
                        'Overnight stay in Colombo'
                    ],
                    stay: 'Colombo'
                },
                {
                    day: 2,
                    title: 'Colombo -> Bentota',
                    activities: [
                        'Breakfast at hotel',
                        'Drive to Bentota (approx 2–3 hours)',
                        'Visit Bentota Beach / Water Sports',
                        'Optional activities: Jet Ski, Banana Boat, Windsurfing',
                        'Explore Brief Garden (Geoffrey Bawa’s garden)',
                        'Evening at leisure',
                        'Overnight stay in Bentota'
                    ],
                    meals: 'Breakfast',
                    stay: 'Bentota'
                },
                {
                    day: 3,
                    title: 'Bentota -> Galle -> Bentota',
                    activities: [
                        'Breakfast at hotel',
                        'Excursion to Galle Fort (UNESCO World Heritage Site)',
                        '  - Explore ramparts, Dutch architecture, lighthouse',
                        '  - Shopping at Galle Fort boutiques & handicraft stores',
                        'Return to Bentota',
                        'Evening free at resort / beach',
                        'Overnight stay in Bentota'
                    ],
                    meals: 'Breakfast',
                    stay: 'Bentota'
                },
                {
                    day: 4,
                    title: 'Bentota -> Kandy',
                    activities: [
                        'Breakfast at hotel',
                        'Drive to Kandy (approx 4 hours)',
                        'Visit Pinnawala Elephant Orphanage en route (optional)',
                        'Check-in at hotel in Kandy',
                        'Evening visit Temple of the Tooth Relic (Sri Dalada Maligawa)',
                        'Optional Cultural Show',
                        'Overnight stay in Kandy'
                    ],
                    meals: 'Breakfast',
                    stay: 'Kandy'
                },
                {
                    day: 5,
                    title: 'Kandy -> Nuwara Eliya',
                    activities: [
                        'Breakfast at hotel',
                        'Proceed to Nuwara Eliya via scenic tea plantations & waterfalls',
                        'Visit Tea Factory & Tea Plantation',
                        'Explore Gregory Lake and Nuwara Eliya town',
                        'Check-in at hotel',
                        'Evening free at leisure',
                        'Overnight stay in Nuwara Eliya'
                    ],
                    meals: 'Breakfast',
                    stay: 'Nuwara Eliya'
                },
                {
                    day: 6,
                    title: 'Nuwara Eliya -> Colombo',
                    activities: [
                        'Breakfast at hotel',
                        'Drive back to Colombo',
                        'En route visit Ramboda Falls',
                        'Optional shopping at Odel / Local markets',
                        'Check-in at Colombo hotel',
                        'Evening free at leisure',
                        'Overnight stay in Colombo'
                    ],
                    meals: 'Breakfast',
                    stay: 'Colombo'
                },
                {
                    day: 7,
                    title: 'Departure – Colombo',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to Bandaranaike International Airport for onward journey',
                        'Tour ends with memorable Sri Lanka experiences'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'BALI HIGHLIGHTS – 4N / 5D',
        destination: 'Bali',
        duration: '4 Nights / 5 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        category: 'Honeymoon',
        details: {
            itineraryDestinations: 'Kuta -> Nusa Penida -> Ubud',
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival – Bali (Kuta)',
                    activities: [
                        'Arrival at Ngurah Rai International Airport, Bali',
                        'Meet & greet by local representative',
                        'Transfer to hotel in Kuta',
                        'Evening free for leisure or Kuta Beach / Seminyak shopping',
                        'Optional sunset at Kuta Beach',
                        'Overnight stay in Kuta'
                    ],
                    stay: 'Kuta'
                },
                {
                    day: 2,
                    title: 'Nusa Penida Island Tour',
                    activities: [
                        'Early breakfast at hotel',
                        'Full-day Nusa Penida Island Tour via speed boat:',
                        '  - Kelingking Beach – Famous T-Rex cliff viewpoint',
                        '  - Broken Beach (Pasih Uug) – Scenic rock formation',
                        '  - Angel’s Billabong – Natural infinity pool',
                        '  - Optional beach swimming & photography',
                        'Lunch included during tour',
                        'Return to Kuta hotel in the evening',
                        'Overnight stay in Kuta'
                    ],
                    meals: 'Breakfast, Lunch',
                    stay: 'Kuta'
                },
                {
                    day: 3,
                    title: 'Kuta -> Ubud Tour',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out and transfer to Ubud',
                        'Visit Tegallalang Rice Terraces – Iconic Bali scenery',
                        'Ubud Monkey Forest – Sacred forest with playful monkeys',
                        'Explore Ubud Palace and local market',
                        'Optional traditional Balinese dance performance in evening',
                        'Check-in at Ubud hotel',
                        'Overnight stay in Ubud'
                    ],
                    meals: 'Breakfast',
                    stay: 'Ubud'
                },
                {
                    day: 4,
                    title: 'Ubud / Bali Highlights',
                    activities: [
                        'Breakfast at hotel',
                        'Full-day sightseeing options:',
                        '  - Tirta Empul Temple – Holy spring water temple',
                        '  - Gunung Kawi Temple – Ancient rock-cut shrine',
                        '  - Coffee Plantation Visit – Try famous Luwak Coffee',
                        'Evening return to hotel',
                        'Free time for spa / shopping / leisure',
                        'Overnight stay in Ubud'
                    ],
                    meals: 'Breakfast',
                    stay: 'Ubud'
                },
                {
                    day: 5,
                    title: 'Departure – Bali',
                    activities: [
                        'Breakfast at hotel',
                        'Check-out',
                        'Transfer to Ngurah Rai International Airport for onward journey',
                        'Tour ends with unforgettable Bali experiences'
                    ],
                    meals: 'Breakfast'
                }
            ]
        }
    },
    {
        title: 'VIETNAM GRAND TOUR – 8N / 9D',
        destination: 'Vietnam',
        duration: '8 Nights / 9 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        category: 'Adventure',
        details: {
            itineraryDestinations: 'Ho Chi Minh City -> Da Nang / Hoi An -> Hanoi -> Halong Bay',
            itinerary: [
                { day: 1, title: 'Arrival – Ho Chi Minh City', activities: ['Arrival at Tan Son Nhat International Airport, Ho Chi Minh City', 'Meet & greet by Nin Bin Tours representative', 'Transfer to hotel & check-in', 'Evening free for leisure or Ben Thanh Market / Nguyen Hue Walking Street', 'Overnight stay in Ho Chi Minh City'], stay: 'Ho Chi Minh City' },
                { day: 2, title: 'Ho Chi Minh City Tour + Cu Chi Tunnels', activities: ['Breakfast at hotel', 'Morning visit Cu Chi Tunnels – Historical Viet Cong network', 'Afternoon Ho Chi Minh City Tour:', '  - Notre Dame Cathedral', '  - Central Post Office', '  - War Remnants Museum', 'Evening free for leisure or shopping', 'Overnight stay in Ho Chi Minh City'], meals: 'Breakfast', stay: 'Ho Chi Minh City' },
                { day: 3, title: 'Mekong Delta Excursion', activities: ['Breakfast at hotel', 'Full-day Mekong Delta tour:', '  - Boat ride through canals', '  - Visit local villages & tropical fruit orchards', '  - Traditional Vietnamese lunch', 'Evening return to hotel', 'Overnight stay in Ho Chi Minh City'], meals: 'Breakfast, Lunch', stay: 'Ho Chi Minh City' },
                { day: 4, title: 'Ho Chi Minh -> Da Nang / Hoi An', activities: ['Breakfast at hotel', 'Check-out and flight to Da Nang', 'Transfer to Hoi An', 'Explore Hoi An Ancient Town:', '  - Japanese Covered Bridge', '  - Tan Ky Old House', '  - Lantern-lit streets & Night Market', 'Check-in at hotel in Hoi An / Da Nang', 'Overnight stay in Hoi An / Da Nang'], meals: 'Breakfast', stay: 'Hoi An / Da Nang' },
                { day: 5, title: 'Da Nang City Tour + Marble Mountains + Ba Na Hills', activities: ['Breakfast at hotel', 'Da Nang City Tour:', '  - Marble Mountains', '  - Cham Museum', '  - Dragon Bridge & Han River', 'Afternoon visit Ba Na Hills & Golden Bridge', '  - Cable car ride', '  - French Village & Fantasy Park', 'Return to hotel', 'Overnight stay in Hoi An / Da Nang'], meals: 'Breakfast', stay: 'Hoi An / Da Nang' },
                { day: 6, title: 'Hoi An -> Hanoi', activities: ['Breakfast at hotel', 'Transfer to Da Nang Airport for flight to Hanoi', 'Arrival & transfer to hotel', 'Evening orientation:', '  - Hoan Kiem Lake & Ngoc Son Temple', '  - Hanoi Old Quarter walking tour', 'Optional Water Puppet Show', 'Overnight stay in Hanoi'], meals: 'Breakfast', stay: 'Hanoi' },
                { day: 7, title: 'Hanoi City Tour', activities: ['Breakfast at hotel', 'Full-day Hanoi sightseeing:', '  - Ho Chi Minh Mausoleum & One Pillar Pagoda', '  - Temple of Literature', '  - Ethnology Museum or local handicraft markets', 'Evening free for shopping / leisure', 'Overnight stay in Hanoi'], meals: 'Breakfast', stay: 'Hanoi' },
                { day: 8, title: 'Halong Bay Cruise', activities: ['Breakfast at hotel', 'Drive to Halong Bay (approx 3–4 hours)', 'Embark on Day Cruise or Overnight Cruise:', '  - Explore limestone karsts & islands', '  - Kayaking & swimming opportunities', '  - Seafood lunch on board', 'Return to Hanoi in evening if day cruise', 'Overnight stay in Hanoi or Halong Bay cruise'], meals: 'Breakfast, Lunch', stay: 'Hanoi / Halong Bay' },
                { day: 9, title: 'Departure – Hanoi', activities: ['Breakfast at hotel / cruise', 'Check-out', 'Transfer to Noi Bai International Airport, Hanoi for onward journey', 'Tour ends with memorable Vietnam experiences'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'CLASSIC CHINA PACKAGE',
        destination: 'China',
        duration: '6 Nights / 7 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
        category: 'Best Seller',
        details: {
            itineraryDestinations: 'Beijing (3N) -> Shanghai (3N)',
            itinerary: [
                { day: 1, title: 'Arrival – Beijing', activities: ['Arrival at Beijing Capital International Airport', 'Meet & greet by Nin Bin Tours representative', 'Transfer to hotel & check-in', 'Evening at leisure to explore Wangfujing Street / local markets', 'Overnight stay in Beijing'], stay: 'Beijing' },
                { day: 2, title: 'Beijing City Tour – Tiananmen Square & Forbidden City', activities: ['Breakfast at hotel', 'Full-day Beijing sightseeing:', '  - Tiananmen Square – World’s largest city square', '  - Forbidden City – Imperial palace museum', '  - Temple of Heaven – UNESCO World Heritage site', 'Optional Peking Duck Dinner in the evening', 'Overnight stay in Beijing'], meals: 'Breakfast', stay: 'Beijing' },
                { day: 3, title: 'Great Wall & Summer Palace', activities: ['Breakfast at hotel', 'Excursion to Great Wall of China (Mutianyu or Badaling section)', '  - Cable car / hiking options available', 'Visit Summer Palace – Imperial gardens & lake', 'Evening free for leisure / shopping', 'Overnight stay in Beijing'], meals: 'Breakfast', stay: 'Beijing' },
                { day: 4, title: 'Beijing -> Shanghai', activities: ['Breakfast at hotel', 'Check-out and transfer to Beijing Railway Station / Airport for High-speed train / flight to Shanghai', 'Arrival & hotel check-in', 'Evening free for Nanjing Road / The Bund stroll', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 5, title: 'Shanghai City Tour – The Bund & Yu Garden', activities: ['Breakfast at hotel', 'Full-day Shanghai sightseeing:', '  - The Bund – Iconic waterfront with colonial architecture', '  - Yu Garden & Old Town – Traditional Chinese garden & market', '  - Jade Buddha Temple – Famous Buddhist temple', 'Optional evening Huangpu River Cruise', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 6, title: 'Shanghai – Pudong Skyline & Shopping', activities: ['Breakfast at hotel', 'Visit Pudong District:', '  - Shanghai Tower / Oriental Pearl Tower – Observation deck for city views', 'Afternoon at leisure for shopping at Nanjing Road / Xintiandi', 'Optional evening acrobatic show / river cruise', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 7, title: 'Departure – Shanghai', activities: ['Breakfast at hotel', 'Check-out', 'Transfer to Shanghai Pudong / Hongqiao Airport for onward journey', 'Tour ends with unforgettable China memories'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'CHINA GRAND TOUR',
        destination: 'China',
        duration: '12 Nights / 13 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1543097692-fa13c6cd8595?auto=format&fit=crop&w=800&q=80',
        category: 'Luxury',
        details: {
            itineraryDestinations: 'Beijing -> Xi’an -> Chengdu -> Yangtze River Cruise -> Shanghai',
            itinerary: [
                { day: 1, title: 'Arrival – Beijing', activities: ['Arrival at Beijing Capital International Airport', 'Meet & greet by Nin Bin Tours representative', 'Transfer to hotel & check-in', 'Evening at leisure / optional Wangfujing Night Market', 'Overnight stay in Beijing'], stay: 'Beijing' },
                { day: 2, title: 'Beijing City Tour', activities: ['Breakfast at hotel', 'Full-day sightseeing:', '  - Tiananmen Square', '  - Forbidden City', '  - Temple of Heaven', 'Optional Peking Duck Dinner', 'Overnight stay in Beijing'], meals: 'Breakfast', stay: 'Beijing' },
                { day: 3, title: 'Great Wall & Summer Palace', activities: ['Breakfast at hotel', 'Excursion to Great Wall of China (Mutianyu / Badaling section)', 'Visit Summer Palace – Imperial gardens & lake', 'Evening at leisure / shopping', 'Overnight stay in Beijing'], meals: 'Breakfast', stay: 'Beijing' },
                { day: 4, title: 'Beijing -> Xi’an', activities: ['Breakfast at hotel', 'Transfer to Beijing Airport / Railway Station for flight / high-speed train to Xi’an', 'Arrival & hotel check-in', 'Evening Xi’an City Wall & Muslim Quarter exploration', 'Overnight stay in Xi’an'], meals: 'Breakfast', stay: 'Xi’an' },
                { day: 5, title: 'Xi’an – Terracotta Warriors & Ancient City', activities: ['Breakfast at hotel', 'Visit Terracotta Army – UNESCO World Heritage Site', 'Afternoon Big Wild Goose Pagoda / Shaanxi History Museum', 'Evening free / optional Tang Dynasty Show', 'Overnight stay in Xi’an'], meals: 'Breakfast', stay: 'Xi’an' },
                { day: 6, title: 'Xi’an -> Chengdu', activities: ['Breakfast at hotel', 'Transfer to Xi’an Airport for flight to Chengdu', 'Arrival & hotel check-in', 'Evening free / explore Jinli Ancient Street', 'Overnight stay in Chengdu'], meals: 'Breakfast', stay: 'Chengdu' },
                { day: 7, title: 'Chengdu – Giant Pandas & Local Cuisine', activities: ['Breakfast at hotel', 'Visit Chengdu Research Base of Giant Panda Breeding', 'Explore Wuhou Shrine & Jinli Street', 'Optional Sichuan Hot Pot dinner', 'Overnight stay in Chengdu'], meals: 'Breakfast', stay: 'Chengdu' },
                { day: 8, title: 'Chengdu -> Yangtze River Cruise (Yichang)', activities: ['Breakfast at hotel', 'Transfer to Yichang / Yangtze River Cruise boarding point', 'Embark on Yangtze River Cruise', 'Afternoon sightseeing on cruise', 'Overnight onboard Yangtze River Cruise'], meals: 'Breakfast', stay: 'Yangtze River Cruise' },
                { day: 9, title: 'Yangtze River Cruise', activities: ['Breakfast on cruise', 'Full-day Yangtze River Cruise sightseeing:', '  - Three Gorges Dam', '  - Shennong Stream / Lesser Gorges (depending on cruise route)', 'Evening onboard leisure', 'Overnight onboard Yangtze River Cruise'], meals: 'Breakfast', stay: 'Yangtze River Cruise' },
                { day: 10, title: 'Yangtze Cruise -> Shanghai', activities: ['Breakfast on cruise', 'Disembark at Yichang / Chongqing', 'Flight / high-speed train to Shanghai', 'Arrival & hotel check-in', 'Evening at leisure / stroll along The Bund', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 11, title: 'Shanghai City Tour', activities: ['Breakfast at hotel', 'Full-day sightseeing:', '  - The Bund – Iconic waterfront', '  - Yu Garden & Old Town', '  - Jade Buddha Temple', 'Optional Huangpu River Cruise in evening', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 12, title: 'Shanghai – Pudong Skyline & Shopping', activities: ['Breakfast at hotel', 'Visit Pudong District / Shanghai Tower / Oriental Pearl Tower', 'Afternoon free for shopping at Nanjing Road / Xintiandi', 'Optional evening Acrobatic Show / Night Cruise', 'Overnight stay in Shanghai'], meals: 'Breakfast', stay: 'Shanghai' },
                { day: 13, title: 'Departure – Shanghai', activities: ['Breakfast at hotel', 'Check-out', 'Transfer to Shanghai Pudong / Hongqiao Airport for onward journey', 'Tour ends with unforgettable China experience'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'BHUTAN HIGHLIGHTS – 7N / 8D (Via West Bengal, India)',
        destination: 'Bhutan',
        duration: '7 Nights / 8 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1621935263625-780c1097654b?auto=format&fit=crop&w=800&q=80',
        category: 'Adventure',
        details: {
            itineraryDestinations: 'Phuentsholing -> Thimphu -> Punakha -> Gangtey -> Paro',
            itinerary: [
                { day: 1, title: 'Arrival – Bagdogra / NJP -> Phuentsholing -> Thimphu', activities: ['Arrive at Bagdogra Airport / NJP Railway Station', 'Meet & greet by Nin Bin Tours representative', 'Drive to Phuentsholing (approx 3–4 hrs)', 'Complete Bhutan immigration formalities (visa/permit)', 'Continue drive to Thimphu (approx 5–6 hrs from Phuentsholing)', 'Evening at leisure in Thimphu', 'Overnight stay in Thimphu'], stay: 'Thimphu' },
                { day: 2, title: 'Thimphu Sightseeing', activities: ['Breakfast at hotel', 'Visit:', '  - Buddha Dordenma Statue – Giant seated Buddha', '  - Tashichho Dzong – Administrative & religious center', '  - National Memorial Chorten', '  - Thimphu Craft Bazaar / Folk Heritage Museum', 'Evening free for shopping or local exploration', 'Overnight stay in Thimphu'], meals: 'Breakfast', stay: 'Thimphu' },
                { day: 3, title: 'Thimphu -> Punakha', activities: ['Breakfast at hotel', 'Drive to Punakha via Dochula Pass (3,100 m)', '  - Stop at 108 Druk Wangyal Chortens', 'Afternoon in Punakha:', '  - Punakha Dzong – Fort at the confluence of Pho Chhu & Mo Chhu rivers', '  - Suspension Bridge & Local Village Walk', 'Evening leisure', 'Overnight stay in Punakha'], meals: 'Breakfast', stay: 'Punakha' },
                { day: 4, title: 'Punakha -> Gangtey (Phobjikha Valley)', activities: ['Breakfast at hotel', 'Drive to Gangtey / Phobjikha Valley (approx 3–4 hrs)', 'Visit Gangtey Monastery – One of Bhutan’s main Nyingmapa monasteries', 'Explore Phobjikha Valley – Scenic valley & Black-necked Crane habitat (seasonal)', 'Evening at leisure', 'Overnight stay in Gangtey'], meals: 'Breakfast', stay: 'Gangtey' },
                { day: 5, title: 'Gangtey -> Paro', activities: ['Breakfast at hotel', 'Drive to Paro (approx 5–6 hrs)', 'En route visit Chele La Pass – Highest motorable pass in Bhutan', 'Evening at leisure in Paro', 'Overnight stay in Paro'], meals: 'Breakfast', stay: 'Paro' },
                { day: 6, title: 'Paro – Tigers Nest Monastery', activities: ['Breakfast at hotel', 'Full-day excursion to Paro Taktsang (Tiger’s Nest Monastery)', '  - Moderate hike through pine forests & cliffs', '  - Explore monastery complex & take photos', 'Evening free', 'Overnight stay in Paro'], meals: 'Breakfast', stay: 'Paro' },
                { day: 7, title: 'Paro Sightseeing', activities: ['Breakfast at hotel', 'Visit:', '  - Rinpung Dzong – Historic fortress & monastery', '  - Kyichu Lhakhang – One of Bhutan’s oldest temples', 'Optional shopping in Paro town', 'Evening at leisure', 'Overnight stay in Paro'], meals: 'Breakfast', stay: 'Paro' },
                { day: 8, title: 'Paro -> Bagdogra Airport / NJP – Departure', activities: ['Breakfast at hotel', 'Check-out and drive to Phuentsholing / Bhutan–India border', 'Complete exit formalities & continue to Bagdogra Airport / NJP Railway Station', 'Tour ends with unforgettable Bhutan memories'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'CAMBODIA EXPLORER – 8N / 9D',
        destination: 'Cambodia',
        duration: '8 Nights / 9 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1565063073722-e3668c072229?auto=format&fit=crop&w=800&q=80',
        category: 'Adventure',
        details: {
            itineraryDestinations: 'Phnom Penh -> Siem Reap -> Sihanoukville',
            itinerary: [
                { day: 1, title: 'Arrival – Phnom Penh', activities: ['Arrive at Phnom Penh Airport and complete immigration formalities.', 'Transfer to hotel for check-in and rest.', 'Afternoon visit Choeung Ek Killing Fields – Site of Pol Pot regime executions.', 'Evening return to hotel.', 'Overnight stay in Phnom Penh'], stay: 'Phnom Penh' },
                { day: 2, title: 'Phnom Penh City Tour', activities: ['Breakfast at hotel.', 'Morning sightseeing:', '  - Royal Palace & Silver Pagoda', '  - National Museum', 'Afternoon visits:', '  - Wat Unalom – Central Buddhist Temple', '  - Wat Phnom Temple – Legendary founding place of Phnom Penh', '  - Tuol Sleng Genocide Museum – Former high school turned prison', '  - Russian Market – Local handicrafts and souvenirs', 'Optional stops: Independence Monument, Diamond Island, or riverside promenade.', 'Overnight stay in Phnom Penh'], meals: 'Breakfast', stay: 'Phnom Penh' },
                { day: 3, title: 'Transfer – Siem Reap', activities: ['Breakfast at hotel.', 'Transfer to Siem Reap via private car.', 'Check-in at hotel and quick rest.', 'Afternoon visit Chong Khneas Floating Village on Tonle Sap Lake.', 'Overnight stay in Siem Reap'], meals: 'Breakfast', stay: 'Siem Reap' },
                { day: 4, title: 'Angkor Temples Tour', activities: ['Breakfast at hotel.', 'Full-day exploration:', '  - Angkor Thom – South Gate, Bayon Temple, Royal Enclosure, Phimeanakas, Elephant Terrace, Terrace of the Leper King', '  - Ta Prohm – Famous “Tomb Raider” temple engulfed by jungle', '  - Angkor Wat – Iconic UNESCO World Heritage site', 'Evening Apsara Dance Show', 'Overnight stay in Siem Reap'], meals: 'Breakfast', stay: 'Siem Reap' },
                { day: 5, title: 'Kulen Mountain & Banteay Srei', activities: ['Breakfast at hotel.', 'Morning excursion to Phnom Kulen (Kulen Mountain National Park) – Sacred site of Khmer Empire', 'Explore river carvings and waterfall', 'Afternoon visit Banteay Srei Temple – Known for intricate carvings', 'Stop at Pradak Village to observe local handicraft and palm sugar production', 'Return to Siem Reap', 'Overnight stay in Siem Reap'], meals: 'Breakfast', stay: 'Siem Reap' },
                { day: 6, title: 'Artisan & Silk Farm + Transfer to Sihanoukville', activities: ['Breakfast at hotel.', 'Morning visit Artisans d’Angkor – Stone sculpture, woodcarving, silk workshops', 'Visit Silk Farm in Puok – 100% authentic Cambodian silk products', 'Afternoon flight to Sihanoukville', 'Transfer to hotel for check-in', 'Overnight stay in Sihanoukville'], meals: 'Breakfast', stay: 'Sihanoukville' },
                { day: 7, title: 'Sihanoukville – Island Excursion', activities: ['Breakfast at hotel.', 'Full-day Island Hopping & Beach Activities:', '  - Koh Chaluh & Koh Tres Islands – Snorkeling, swimming, relaxation', '  - Koh Russei Island – Beach activities & trekking', 'Beach BBQ Lunch with seafood or meat, soft drinks, and fruits', 'Return to mainland in late evening', 'Overnight stay in Sihanoukville'], meals: 'Breakfast, Lunch', stay: 'Sihanoukville' },
                { day: 8, title: 'Sihanoukville – Phnom Penh Departure', activities: ['Breakfast at hotel.', 'Morning free for packing and personal activities.', 'Check-out and transfer to Phnom Penh Airport for departure.'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'NEPAL HIGHLIGHTS TOUR – 6N / 7D',
        destination: 'Nepal',
        duration: '6 Nights / 7 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        category: 'Adventure',
        details: {
            itineraryDestinations: 'Kathmandu -> Chitwan -> Pokhara -> Kathmandu',
            itinerary: [
                { day: 1, title: 'Arrival – Kathmandu', activities: ['Arrive at Tribhuvan International Airport, Kathmandu', 'Meet & greet by Nin Bin Tours representative', 'Transfer to hotel for check-in and rest', 'Evening at leisure / optional stroll in Thamel Market', 'Overnight stay in Kathmandu'], stay: 'Kathmandu' },
                { day: 2, title: 'Kathmandu Sightseeing', activities: ['Breakfast at hotel', 'Full-day Kathmandu Valley Tour:', '  - Swayambhunath (Monkey Temple) – UNESCO World Heritage Site with panoramic city views', '  - Boudhanath Stupa – One of the largest Buddhist stupas in the world', '  - Pashupatinath Temple – Sacred Hindu temple on Bagmati River', '  - Durbar Square – Ancient palaces, courtyards, and temples', 'Evening at leisure', 'Overnight stay in Kathmandu'], meals: 'Breakfast', stay: 'Kathmandu' },
                { day: 3, title: 'Kathmandu -> Chitwan', activities: ['Breakfast at hotel', 'Drive to Chitwan National Park (approx 5–6 hours)', 'Check-in at lodge / resort', 'Afternoon Tharu Village visit – Local culture and lifestyle', 'Optional Cultural program / Tharu dance in evening', 'Overnight stay in Chitwan'], meals: 'Breakfast', stay: 'Chitwan' },
                { day: 4, title: 'Chitwan – Jungle Safari', activities: ['Breakfast at lodge', 'Full-day Chitwan National Park Activities:', '  - Jeep Safari / Elephant Safari – Spot rhinos, deer, monkeys, crocodiles, and birds', '  - Canoe Ride – Observe river wildlife', '  - Nature Walk – Explore flora & fauna of the park', 'Evening at leisure', 'Overnight stay in Chitwan'], meals: 'Breakfast', stay: 'Chitwan' },
                { day: 5, title: 'Chitwan -> Pokhara', activities: ['Breakfast at lodge', 'Drive to Pokhara (approx 4–5 hours)', 'Check-in at hotel', 'Evening Fewa Lake & Lakeside stroll – Relax by the lake and enjoy mountain views', 'Overnight stay in Pokhara'], meals: 'Breakfast', stay: 'Pokhara' },
                { day: 6, title: 'Pokhara Sightseeing', activities: ['Breakfast at hotel', 'Full-day Pokhara Tour:', '  - Sarangkot Sunrise View – Himalayan panorama including Annapurna and Dhaulagiri (optional early morning)', '  - Devi’s Fall & Gupteshwor Cave', '  - World Peace Pagoda – Scenic views of Phewa Lake & surrounding mountains', '  - International Mountain Museum – History of mountaineering and Himalayan culture', 'Evening at leisure', 'Overnight stay in Pokhara'], meals: 'Breakfast', stay: 'Pokhara' },
                { day: 7, title: 'Pokhara -> Kathmandu – Departure', activities: ['Breakfast at hotel', 'Drive / flight back to Kathmandu', 'Transfer to Tribhuvan International Airport for onward journey', 'Tour ends with unforgettable Nepal experiences'], meals: 'Breakfast' }
            ]
        }
    },
    {
        title: 'PHU QUOC ESCAPADE – 5D / 4N',
        destination: 'Vietnam',
        duration: '4 Nights / 5 Days',
        price: 'Contact for Price',
        image: 'https://images.unsplash.com/photo-1559592413-73d93036fe17?auto=format&fit=crop&w=800&q=80',
        category: 'Best Seller',
        details: {
            itineraryDestinations: 'Phu Quoc',
            itinerary: [
                { day: 1, title: 'Arrival – Phu Quoc & Grand World', activities: ['Arrive at Phu Quoc Airport and meet your tour guide and driver.', 'Transfer to hotel for check-in (from 14:00).', 'Late afternoon visit Grand World – 24/7 recreational complex with shopping, dining, art performances, and entertainment.', 'Optional activities (self-pay):', '  - Teddy Bear Museum: 9 USD', '  - Boat Trip on Venice River: 9 USD', '  - Quintessence of Vietnam Phu Quoc: 13 USD', 'Overnight stay in Phu Quoc'], stay: 'Phu Quoc' },
                { day: 2, title: 'Vinpearl Safari – VinWonders', activities: ['Breakfast at hotel.', 'Morning visit Vinpearl Safari – Semi-wild safari park and open zoo with guided bus rides, showcasing free-roaming animals in naturalistic habitats.', 'Afternoon explore VinWonders – Southwest Vietnam’s largest amusement park with over 100 attractions, including indoor/outdoor rides, water park, and dolphin shows.', 'Overnight stay in Phu Quoc'], meals: 'Breakfast', stay: 'Phu Quoc' },
                { day: 3, title: 'Hon Thom Cable Car – Kiss Bridge – Sunset Town', activities: ['Breakfast at hotel.', '10:00 – Take the Hon Thom Cable Car – Longest sea cable car in the world.', 'Explore Aquatopia Hon Thom Water Park, Southeast Asia’s largest water park.', '16:00 – Photo stop at Kiss Bridge.', '17:30 – Visit Sunset Town, Mediterranean-inspired coastal area.', '18:30 – VUIFest Bazaar Night Market – Street art shows and Vietnamese cuisine.', '21:00 – Optional Kiss Of The Sea multimedia show (self-pay).', '21:30 – Beachside firework show at Sunset Town.', '22:00 – Return to hotel.', 'Overnight stay in Phu Quoc'], meals: 'Breakfast', stay: 'Phu Quoc' },
                { day: 4, title: '3 Islands Trip by Speed Boat', activities: ['Breakfast at hotel.', '08:00 – Pick-up from hotel/resort. Bring sunscreen & swimwear.', '09:00 – Board canoe at An Thoi Port for island-hopping across 12 islands.', 'Visit:', '  - Coral Park – Optional sea walker activity (self-pay)', '  - Mong Tay Island – White sandy beaches, clear water, coral exploration', '  - Gam Ghi Island (Dam Ngang) – Unique rock formations and coral diving', 'Return to hotel for relaxation.', 'Overnight stay in Phu Quoc'], meals: 'Breakfast', stay: 'Phu Quoc' },
                { day: 5, title: 'Departure – Phu Quoc', activities: ['Breakfast at hotel.', 'Free time for shopping or leisure.', 'Transfer to Phu Quoc Airport for departure (driver only, no guide).', 'End of tour with unforgettable memories'], meals: 'Breakfast' }
            ]
        }
    }
];

async function main() {
    console.log('Start seeding ...');

    // 1. Clean up existing data
    console.log('Cleaning up existing data...');
    await prisma.package.deleteMany({});
    // Wait a bit to ensure deletion propagates (MongoDB sometimes...)
    await prisma.stateExplorer.deleteMany({});
    await prisma.destination.deleteMany({});
    console.log('Data cleaned.');

    // 2. Create Destinations
    console.log('Creating Destinations...');
    const destinationMap = {};
    for (const dest of destinations) {
        const created = await prisma.destination.create({
            data: {
                name: dest.name,
                image: dest.image,
                description: `Explore the beauty of ${dest.name}`,
                details: {},
                isInternational: true,
                isVisible: true
            }
        });
        destinationMap[dest.name] = created.id;
        console.log(`Created destination: ${dest.name}`);
    }

    // 3. Create Packages
    console.log('Creating Packages...');
    for (const pkg of packages) {
        const destId = destinationMap[pkg.destination];
        if (!destId) {
            console.error(`Destination not found for package: ${pkg.title} (${pkg.destination})`);
            continue;
        }

        await prisma.package.create({
            data: {
                title: pkg.title,
                navTitle: pkg.title.split('–')[0].trim().substring(0, 15), // Short nav title
                category: pkg.category,
                image: pkg.image,
                price: pkg.price,
                duration: pkg.duration,
                description: `Experience ${pkg.title}`,
                details: pkg.details,
                destinationId: destId
            }
        });
        console.log(`Created package: ${pkg.title}`);
    }

    // 4. Create State Explorers (derived from packages)
    // Logic: For each package, create StateExplorers based on its itineraryDestinations
    // This is a simplification as StateExplorers effectively act as sub-destinations
    console.log('Creating State Explorers...');
    const stateExplorers = [
        { name: 'Phuket', destination: 'Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80' },
        { name: 'Krabi', destination: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kuala Lumpur', destination: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80' },
        { name: 'Langkawi', destination: 'Malaysia', image: 'https://images.unsplash.com/photo-1549420084-2a6c1170d55e?auto=format&fit=crop&w=800&q=80' },
        { name: 'Genting Highlands', destination: 'Malaysia', image: 'https://images.unsplash.com/photo-1587898083818-7b989392f447?auto=format&fit=crop&w=800&q=80' },
        { name: 'Singapore City', destination: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Male', destination: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Colombo', destination: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1588258524675-96c26b67b92e?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kandy', destination: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kuta', destination: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
        { name: 'Ubud', destination: 'Bali', image: 'https://images.unsplash.com/photo-1558299797-40082725f0e1?auto=format&fit=crop&w=800&q=80' },
        { name: 'Ho Chi Minh City', destination: 'Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { name: 'Hanoi', destination: 'Vietnam', image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80' },
        { name: 'Beijing', destination: 'China', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Shanghai', destination: 'China', image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80' },
        { name: 'Thimphu', destination: 'Bhutan', image: 'https://images.unsplash.com/photo-1621935263625-780c1097654b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Siem Reap', destination: 'Cambodia', image: 'https://images.unsplash.com/photo-1565063073722-e3668c072229?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kathmandu', destination: 'Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
        { name: 'Phu Quoc', destination: 'Vietnam', image: 'https://images.unsplash.com/photo-1559592413-73d93036fe17?auto=format&fit=crop&w=800&q=80' }
    ];

    for (const se of stateExplorers) {
        const destId = destinationMap[se.destination];
        if (destId) {
            await prisma.stateExplorer.create({
                data: {
                    name: se.name,
                    image: se.image,
                    description: `Explore ${se.name}`,
                    destinationId: destId
                }
            });
            console.log(`Created state explorer: ${se.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
