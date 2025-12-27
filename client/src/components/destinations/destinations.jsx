import React, { useRef, useEffect, useState, forwardRef, Suspense } from "react";
const Globe = React.lazy(() => import("react-globe.gl"));
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Stars from "./Stars";
import "./destinations.css";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

gsap.registerPlugin(ScrollTrigger);
// ... existing code ...




const international = [
    {
        name: "Azerbaijan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Azerbaijan.webp",
        lat: 40.1431,
        lng: 47.5769,
        description: "Known as the Land of Fire, blending ancient history with modern futuristic architecture."
    },
    {
        name: "Bali",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bali.webp",
        lat: -8.7892,
        lng: 115.2162,
        description: "A tropical paradise famed for its stunning beaches, spirituality, and vibrant culture."
    },
    {
        name: "Bhutan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Bhutan.webp",
        lat: 27.4667,
        lng: 90.4667,
        description: "The Last Shangri-La, offering breathtaking Himalayan landscapes and rich Buddhist heritage."
    },
    {
        name: "Dubai",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Dubai.webp",
        lat: 25.2044,
        lng: 55.2714,
        description: "A city of superlatives with towering skyscrapers, luxury shopping, and desert adventures.",
        badge: "Best Seller"
    },
    {
        name: "Kazakhstan",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Kazakhstan.webp",
        lat: 43.2467,
        lng: 66.9667,
        description: "The heart of Central Asia, featuring vast steppes, mountains, and modern cities."
    },
    {
        name: "Malaysia",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Malaysia.webp",
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
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/Sri%20Lanka.webp",
        lat: 6.9315,
        lng: 79.8667,
        description: "The Pearl of the Indian Ocean, rich in history, wildlife, and golden sandy beaches."
    },
    {
        name: "Thailand",
        image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png",
        lat: 13.7563,
        lng: 100.5018,
        description: "The Land of Smiles, famous for its temples, street food, and tropical islands.",
        badge: "Best Seller"
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
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp",
        lat: 10.0889,
        lng: 77.0595,
        description: "Rolling tea gardens and misty hills make this a perfect honey-moon destination."
    },
    {
        name: "Wayanad",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/wayanad.webp",
        lat: 11.6854,
        lng: 76.1320,
        description: "A green paradise with waterfalls, caves, and exotic wildlife in Kerala."
    },
    {
        name: "Varkala",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/varkala.webp",
        lat: 8.7379,
        lng: 76.7163,
        description: "Famous for its stunning cliff-side beaches and relaxed coastal vibe."
    },
    {
        name: "Alleppey",
        image: "https://ik.imagekit.io/tsxbvz4jb6/Laymans/kerala.webp",
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
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const containerRef = useRef(null);
    const [mobileTab, setMobileTab] = useState("international");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Get Active List based on Mobile Tab
    const currentList = mobileTab === "international" ? international : domestic;

    /* ================== PLACE SELECT ================== */
    const handleSelect = (place) => {
        if (activePlace?.name === place.name) return;
        setActivePlace(place);
        setCardVisible(true);
        // Animation is triggered by useEffect above
    };

    /* ================== ANIMATION SEQUENCE ================== */
    useEffect(() => {
        if (!activePlace) return;

        // SKIP COMPLEX PANEL ANIMATIONS ON MOBILE
        if (isMobile) {
            if (activePlace && cardVisible) {
                // 1. Rotate Globe
                if (globeRef.current) {
                    const { lat, lng } = activePlace;
                    globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 1000);
                }

                // 2. Animate Card Slide Up
                gsap.fromTo(".dest-card",
                    { y: "100%", opacity: 0 },
                    { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            } else if (!cardVisible) {
                // Animate Card Slide Down (Close)
                gsap.to(".dest-card",
                    { y: "100%", opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => setActivePlace(null) }
                );
            }
            return;
        }

        const tl = gsap.timeline();
        selectionTimeline.current = tl;

        if (window.innerWidth > 768) {
            // DESKTOP: Complex Entry
            tl.to([".dest-panel.left", ".dest-panel.right"], {
                opacity: 0,
                x: (i, target) => target.classList.contains("left") ? -50 : 50,
                duration: 0.5,
                ease: "power2.in"
            })
                // Move Globe to Left
                .to(containerRef.current, {
                    x: "-25%",
                    duration: 1,
                    ease: "power3.inOut"
                }, "-=0.2")

                // Reveal Card
                .fromTo(".dest-card",
                    { x: "20%", opacity: 0, scale: 0.9 },
                    { x: "0%", opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
                    "+=0.2"
                )

                // Draw Arrow
                .fromTo(".connection-arrow",
                    { opacity: 0 },
                    { opacity: 1, duration: 0.1 },
                    "-=0.6"
                )
                .fromTo(".arrow-path",
                    { strokeDasharray: 2000, strokeDashoffset: 2000 },
                    { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
                    "<"
                )
                .fromTo(".arrow-head",
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.1, ease: "back.out(2)" },
                    "-=0.3"
                );
        }

        // Rotate Globe to Location
        if (globeRef.current) {
            const { lat, lng } = activePlace;
            globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 1200);
        }

    }, [activePlace, cardVisible, isMobile]);

    /* ================== RESIZE OBSERVER ================== */
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        // Initial measurement
        updateDimensions();

        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            observer.disconnect();
        };
    }, []);

    /* ================== GLOBE SETUP ================== */
    const handleGlobeReady = () => {
        if (!globeRef.current) return;

        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false;
        controls.enablePan = true;

        globeRef.current.pointOfView(DEFAULT_VIEW);
    };

    /* ================== ROTATION CONTROL ================== */
    useEffect(() => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            if (controls) {
                controls.autoRotate = !cardVisible;
            }
        }
    }, [cardVisible]);

    /* ================== SCROLL + ENTRY ================== */
    useGSAP(() => {
        const resetToInitialState = () => {
            if (selectionTimeline.current) {
                selectionTimeline.current.kill();
            }
            setCardVisible(false);
            setActivePlace(null);

            // GSAP Hard Reset - Clear Props to revert to CSS
            gsap.set([".dest-panel.left", ".dest-panel.right"], { clearProps: "all" });
            if (containerRef.current) gsap.set(containerRef.current, { clearProps: "all" });
            if (cardRef.current) gsap.set(cardRef.current, { clearProps: "all" });

            globeRef.current?.pointOfView(DEFAULT_VIEW, 1000);
        };

        // Pinning/Scroll Logic
        ScrollTrigger.create({
            trigger: internalSectionRef.current,
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: true,
            onEnterBack: () => resetToInitialState(),
            onLeave: () => resetToInitialState()
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

    /* ================== ARROW COMPONENT ================== */
    const ConnectionArrow = ({ width, height }) => {
        // Dynamic coordinates to prevent distortion
        const startX = width * 0.25; // Center of Globe area (Globe is moved to left 25%)
        const startY = height * 0.5;

        // Card Position Calculation:
        // Overlay padding-right is 15% (on desktop).
        // Card has margin-right: 150px (NEW).
        // Card width is 320px.
        const cardWidth = 320;
        const marginRight = 150;
        const paddingRight = 0.15 * width;

        // Calculate Right Edge of Card Container relative to screen right
        // ScreenWidth - Padding - Margin - CardWidth
        // We add overlap (+20) to land on the card
        const endX = (width - paddingRight - marginRight - cardWidth) + 20;
        const endY = height * 0.5;

        // Control point for the curve (arc up)
        const controlX = (startX + endX) / 2;
        const controlY = startY - (height * 0.2); // Arc height

        // Calculate arrowhead angle
        const dx = endX - controlX;
        const dy = endY - controlY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
            <svg className="connection-arrow" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                <path
                    className="arrow-path"
                    d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <g transform={`translate(${endX}, ${endY}) rotate(${angle})`}>
                    <polygon
                        className="arrow-head"
                        points="4,0 -12,-6 -12,6"
                        fill="#e11d48"
                    />
                </g>
            </svg>
        );
    };

    /* ================== ANIMATION REFS ================== */
    const selectionTimeline = useRef(null);



    /* ================== NAVIGATE TO EXPLORER ================== */
    const handleExploreClick = () => {
        // Just trigger selection, parent handles transition
        if (onCountrySelect && activePlace) {
            onCountrySelect(activePlace.name);
        }
    };

    const handleCloseCard = () => {
        if (selectionTimeline.current) selectionTimeline.current.kill();

        const tl = gsap.timeline({
            onComplete: () => {
                setCardVisible(false);
                setActivePlace(null);
            }
        });
        selectionTimeline.current = tl;

        if (window.innerWidth > 768) {
            // DESKTOP REVERSE
            // 1. Hide Card & Arrow
            tl.to(".dest-card", {
                x: "10%",
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            })
                .to(".connection-arrow", {
                    opacity: 0,
                    duration: 0.3
                }, "<")
                // 2. Move Globe Center
                .to(containerRef.current, {
                    x: "0%",
                    duration: 0.8,
                    ease: "power3.inOut"
                }, "-=0.2")
                // 3. Show Panels
                .to([".dest-panel.left", ".dest-panel.right"], {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    pointerEvents: "auto",
                    ease: "power3.out"
                }, "-=0.4");
        } else {
            // MOBILE REVERSE: Slide down card
            tl.to(".dest-card", {
                y: "100%",
                opacity: 0,
                duration: 0.4,
                ease: "power3.in"
            });
        }

        // Reset Globe View
        globeRef.current?.pointOfView(DEFAULT_VIEW, 1200);
    };

    return (
        <section
            id="destinations"
            className={`destinations-section ${isMobile ? 'mobile-view' : ''}`}
            ref={internalSectionRef}
        >
            {
                isMobile ? (
                    /* ================= MOBILE LAYOUT ================= */
                    <div className="mobile-layout-container" >
                        {/* 1. Globe Area (Fixed at top) */}
                        < div className="mobile-globe-area" ref={containerRef} >
                            <Stars />
                            <Suspense fallback={<div className="globe-loader">Loading...</div>}>
                                <Globe
                                    ref={globeRef}
                                    onGlobeReady={handleGlobeReady}
                                    enableZoom={false}
                                    width={dimensions.width}
                                    height={dimensions.height * 0.45} // 45% of screen height
                                    globeImageUrl="/assets/earth-blue-marble.jpg"
                                    bumpImageUrl="/assets/earth-topology.png"
                                    backgroundColor="rgba(0,0,0,0)"
                                    atmosphereColor="#1cbae5"
                                    atmosphereAltitude={0.15}
                                    htmlElementsData={activePlace ? [activePlace] : []}
                                    htmlLat="lat"
                                    htmlLng="lng"
                                    htmlElement={() => {
                                        const el = document.createElement("div");
                                        el.className = "dest-map-pin";
                                        el.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#e11d48"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>`;
                                        return el;
                                    }}
                                />
                            </Suspense>
                        </div >

                        {/* 2. Controls & List Container */}
                        < div className="mobile-controls-area" >
                            {/* Tab Switcher */}
                            < div className="mobile-tabs" >
                                <button
                                    className={`mobile-tab-btn ${mobileTab === 'international' ? 'active' : ''}`}
                                    onClick={() => setMobileTab('international')}
                                >
                                    International
                                </button>
                                <button
                                    className={`mobile-tab-btn ${mobileTab === 'domestic' ? 'active' : ''}`}
                                    onClick={() => setMobileTab('domestic')}
                                >
                                    Domestic
                                </button>
                            </div >

                            {/* List */}
                            < div className="mobile-dest-list" style={{ opacity: cardVisible ? 0.3 : 1 }}>
                                <h4 className="mobile-list-title">
                                    {mobileTab === 'international' ? 'World Destinations' : 'Domestic Treasures'}
                                </h4>
                                <ul className="dest-panel-list">
                                    {currentList.map(d => (
                                        <li key={d.name} onClick={() => handleSelect(d)}>
                                            <div className="dest-li-content">
                                                <span className="dest-country-name">{d.name}</span>
                                                {d.badge && <span className="dest-badge">{d.badge}</span>}
                                            </div>
                                            <span className="dest-arrow">→</span>
                                        </li>
                                    ))}
                                </ul>
                            </div >
                        </div >
                    </div >
                ) : (
                    /* ================= DESKTOP LAYOUT ================= */
                    <>
                        {/* LEFT PANEL */}
                        <aside className={`dest-panel left ${cardVisible ? 'faded' : ''}`}>
                            <div className="dest-panel-header">
                                <span className="dest-panel-tag">Explore</span>
                                <h4 className="dest-panel-title">International</h4>
                            </div>

                            <ul className="dest-panel-list">
                                {international.map(d => (
                                    <li key={d.name} onClick={() => handleSelect(d)}>
                                        <div className="dest-li-content">
                                            <span className="dest-country-name">{d.name}</span>
                                            {d.badge && <span className="dest-badge">{d.badge}</span>}
                                        </div>
                                        <span className="dest-arrow">→</span>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* RIGHT PANEL */}
                        <aside className={`dest-panel right ${cardVisible ? 'faded' : ''}`}>
                            <div className="dest-panel-header">
                                <span className="dest-panel-tag">Discover</span>
                                <h4 className="dest-panel-title">Domestic</h4>
                            </div>

                            <ul className="dest-panel-list">
                                {domestic.map(d => (
                                    <li key={d.name} onClick={() => handleSelect(d)}>
                                        <span className="dest-country-name">{d.name}</span>
                                        <span className="dest-arrow">→</span>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* GLOBE */}
                        <div className={`dest-globe-wrap ${cardVisible ? 'dimmed' : ''}`} ref={containerRef}>
                            <Stars />
                            <Suspense fallback={<div className="dest-globe-loader">Loading Globe...</div>}>
                                <Globe
                                    ref={globeRef}
                                    onGlobeReady={handleGlobeReady}
                                    enableZoom={false}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    globeImageUrl="/assets/earth-blue-marble.jpg"
                                    bumpImageUrl="/assets/earth-topology.png"
                                    backgroundColor="rgba(0,0,0,0)"
                                    atmosphereColor="#1cbae5"
                                    atmosphereAltitude={0.15}
                                    htmlElementsData={activePlace ? [activePlace] : []}
                                    htmlLat="lat"
                                    htmlLng="lng"
                                    htmlElement={(d) => {
                                        const el = document.createElement("div");
                                        el.className = "dest-map-pin";
                                        el.innerHTML = `
                                    <svg width="26" height="26" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#e11d48"/>
                                        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                                    </svg>
                                    `;
                                        return el;
                                    }}
                                />
                            </Suspense>
                        </div>

                        {/* CONNECTION ARROW (Desktop Only) */}
                        {activePlace && cardVisible && (
                            <ConnectionArrow width={dimensions.width} height={dimensions.height} />
                        )}
                    </>
                )}

            {/* OVERLAY CARD (Shared) */}
            {
                activePlace && cardVisible && (
                    <div className="dest-card-overlay">
                        <div className="dest-card" ref={cardRef}>
                            <button className="dest-close-btn" onClick={handleCloseCard}>×</button>
                            <div className="dest-card-image">
                                <img src={getOptimizedUrl(activePlace.image, 800)} alt={activePlace.name} />
                            </div>
                            <div className="dest-card-content">
                                <h3>{activePlace.name}</h3>
                                <p>{activePlace.description}</p>
                                <button className="dest-explore-btn" onClick={handleExploreClick}>
                                    Explore {activePlace.name}
                                    <span className="dest-btn-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
});

export default Destinations;