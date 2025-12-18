import React, { useRef, useEffect, useState, forwardRef } from "react";
import Globe from "react-globe.gl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./destinations.css";

gsap.registerPlugin(ScrollTrigger);

const international = [
    {
        name: "Azerbaijan",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655272/Azerbaijan_zx809y.png",
        lat: 40.1431,
        lng: 47.5769,
        description: "Known as the Land of Fire, blending ancient history with modern futuristic architecture."
    },
    {
        name: "Bali",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Bali_nycaoz.jpg",
        lat: -8.7892,
        lng: 115.2162,
        description: "A tropical paradise famed for its stunning beaches, spirituality, and vibrant culture."
    },
    {
        name: "Bhutan",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655259/Bhutan_bvh2xs.png",
        lat: 27.4667,
        lng: 90.4667,
        description: "The Last Shangri-La, offering breathtaking Himalayan landscapes and rich Buddhist heritage."
    },
    {
        name: "Dubai",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Dubai_zpadzs.jpg",
        lat: 25.2044,
        lng: 55.2714,
        description: "A city of superlatives with towering skyscrapers, luxury shopping, and desert adventures."
    },
    {
        name: "Kazakhstan",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655271/Kazakhstan_zdwuir.png",
        lat: 43.2467,
        lng: 66.9667,
        description: "The heart of Central Asia, featuring vast steppes, mountains, and modern cities."
    },
    {
        name: "Malaysia",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655260/Malaysia_f61tdf.png",
        lat: 3.1390,
        lng: 101.6937,
        description: "A melting pot of cultures with iconic towers, rainforests, and beautiful islands."
    },
    {
        name: "Singapore",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655249/Singapore_gvfyn6.jpg",
        lat: 1.3521,
        lng: 103.8198,
        description: "A futuristic city-state known for its cleanliness, green spaces, and diverse food scene."
    },
    {
        name: "Sri Lanka",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655257/Sri_Lanka_uux3sy.png",
        lat: 6.9315,
        lng: 79.8667,
        description: "The Pearl of the Indian Ocean, rich in history, wildlife, and golden sandy beaches."
    },
    {
        name: "Thailand",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png",
        lat: 13.7563,
        lng: 100.5018,
        description: "The Land of Smiles, famous for its temples, street food, and tropical islands."
    },
    {
        name: "Vietnam",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655268/Vietnam_qgebdl.png",
        lat: 10.8236,
        lng: 106.6290,
        description: "A country of staggering natural beauty and cultural complexities."
    },
];

const domestic = [
    {
        name: "Munnar",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446410/munnar_wdhd05.png",
        lat: 10.0889,
        lng: 77.0595,
        description: "Rolling tea gardens and misty hills make this a perfect honey-moon destination."
    },
    {
        name: "Wayanad",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446721/wayanad_l8wmyr.png",
        lat: 11.6854,
        lng: 76.1320,
        description: "A green paradise with waterfalls, caves, and exotic wildlife in Kerala."
    },
    {
        name: "Varkala",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446410/varkala_c8nxll.png",
        lat: 8.7379,
        lng: 76.7163,
        description: "Famous for its stunning cliff-side beaches and relaxed coastal vibe."
    },
    {
        name: "Alleppey",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Kerala_xewptj.png",
        lat: 9.4981,
        lng: 76.3388,
        description: "The Venice of the East, renowned for its tranquil backwaters and houseboats."
    },
];

const DEFAULT_VIEW = { altitude: 2.5 };

const Destinations = forwardRef(({ onCountrySelect }, ref) => {
    const globeRef = useRef(null);
    // Use the forwarded ref if provided, otherwise internal fallback (though usually parent will provide ref)
    // To handle both, we can use useImperativeHandle or just direct ref assignment if valid.
    // Simplest for animation: Ref can be attached to the section.

    // We need to merge internal ref usage (if any) with forwarded ref.
    // However, the original code used `sectionRef` internally for ScrollTrigger.
    // We should expose that element.
    const internalSectionRef = useRef(null);

    // Merge refs
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(internalSectionRef.current);
        } else {
            ref.current = internalSectionRef.current;
        }
    }, [ref]);

    const cardRef = useRef(null);
    const [activePlace, setActivePlace] = useState(null);
    const [cardVisible, setCardVisible] = useState(false);

    /* ================== GLOBE SETUP ================== */
    useEffect(() => {
        if (!globeRef.current) return;

        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false;
        controls.enablePan = false;

        globeRef.current.pointOfView(DEFAULT_VIEW);
    }, []);

    /* ================== SCROLL + ENTRY ================== */
    useGSAP(() => {
        // Pinning/Scroll Logic
        ScrollTrigger.create({
            trigger: internalSectionRef.current,
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            onEnterBack: () => {
                setCardVisible(false);
                setActivePlace(null);
                globeRef.current?.pointOfView(DEFAULT_VIEW, 1000);
            }
        });

        // Entry Animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: internalSectionRef.current,
                start: "top bottom-=100", // Triggers when top of section acts hits bottom of viewport (minus 100px buffer)
                end: "center center",
                toggleActions: "play none none none" // Play and stay visible
            }
        });

        tl.fromTo(".dest-panel.left",
            { x: -120, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }
        )
            .fromTo(".dest-panel.right",
                { x: 120, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "<");

    }, { scope: internalSectionRef });

    /* ================== CARD ANIMATION ================== */
    useEffect(() => {
        if (activePlace && cardVisible && cardRef.current) {
            // Find the pin element
            const pinEl = document.querySelector(".map-pin");
            let startProps = { opacity: 0, scale: 0.1, y: 0, x: 0 };

            if (pinEl) {
                const rect = pinEl.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // Calculate distance from center
                // Pin is centered at rect.left + rect.width / 2
                const pinX = rect.left + rect.width / 2;
                const pinY = rect.top + rect.height / 2;

                startProps.x = pinX - centerX;
                startProps.y = pinY - centerY;
            }

            gsap.fromTo(cardRef.current,
                startProps,
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "expo.out"
                }
            );
        }
    }, [activePlace, cardVisible]);


    /* ================== PLACE SELECT ================== */
    const handleSelect = (place) => {
        setActivePlace(place);
        setCardVisible(false); // Reset first

        // Rotate globe to place
        if (globeRef.current) {
            globeRef.current.pointOfView(
                { lat: place.lat, lng: place.lng, altitude: 1.5 }, // Closer zoom
                1500
            );
        }

        // Show card after rotation starts
        setTimeout(() => {
            setCardVisible(true);
        }, 800);
    };

    /* ================== NAVIGATE TO EXPLORER ================== */
    const handleExploreClick = () => {
        // Just trigger selection, parent handles transition
        if (onCountrySelect && activePlace) {
            onCountrySelect(activePlace.name);
        }
    };

    const handleCloseCard = () => {
        setCardVisible(false);
        setActivePlace(null);
        globeRef.current?.pointOfView(DEFAULT_VIEW, 1000);
    };

    return (
        <section
            id="destinations"
            className="destinations-section"
            ref={internalSectionRef}
        >
            {/* LEFT PANEL */}
            <aside className={`dest-panel left ${cardVisible ? 'faded' : ''}`}>
                <div className="panel-header">
                    <span className="panel-tag">Explore</span>
                    <h4 className="panel-title">International</h4>
                </div>

                <ul className="panel-list">
                    {international.map(d => (
                        <li key={d.name} onClick={() => handleSelect(d)}>
                            <span className="country-name">{d.name}</span>
                            <span className="arrow">→</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* RIGHT PANEL */}
            <aside className={`dest-panel right ${cardVisible ? 'faded' : ''}`}>
                <div className="panel-header">
                    <span className="panel-tag">Discover</span>
                    <h4 className="panel-title">Domestic</h4>
                </div>

                <ul className="panel-list">
                    {domestic.map(d => (
                        <li key={d.name} onClick={() => handleSelect(d)}>
                            <span className="country-name">{d.name}</span>
                            <span className="arrow">→</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* GLOBE */}
            <div className={`globe-wrap ${cardVisible ? 'dimmed' : ''}`}>
                <Globe
                    ref={globeRef}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="#000000"
                    atmosphereColor="#1cbae5"
                    atmosphereAltitude={0.15}
                    htmlElementsData={activePlace ? [activePlace] : []}
                    htmlLat="lat"
                    htmlLng="lng"
                    htmlElement={(d) => {
                        const el = document.createElement("div");
                        el.className = "map-pin";
                        el.innerHTML = `
              <svg width="26" height="26" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#e11d48"/>
                <circle cx="12" cy="9" r="2.5" fill="#fff"/>
              </svg>
            `;
                        return el;
                    }}
                />
            </div>

            {/* OVERLAY CARD */}
            {activePlace && cardVisible && (
                <div className="destination-card-overlay">
                    <div className="destination-card" ref={cardRef}>
                        <button className="close-card-btn" onClick={handleCloseCard}>×</button>
                        <div className="card-image">
                            <img src={activePlace.image} alt={activePlace.name} />
                        </div>
                        <div className="card-content">
                            <h3>{activePlace.name}</h3>
                            <p>{activePlace.description}</p>
                            <button className="explore-btn" onClick={handleExploreClick}>
                                Explore {activePlace.name}
                                <span className="btn-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
});

export default Destinations;