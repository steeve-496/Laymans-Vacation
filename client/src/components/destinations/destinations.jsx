import React, { useRef, useEffect, useState, forwardRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
const Globe = React.lazy(() => import("react-globe.gl"));
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Stars from "./Stars";
import "./destinations.css";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import api from "../../utils/api";

gsap.registerPlugin(ScrollTrigger);
// ... existing code ...






const DEFAULT_VIEW = { altitude: 2.5 };

const Destinations = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const globeRef = useRef(null);

    // State for dynamic data
    const [international, setInternational] = useState([]);
    const [domestic, setDomestic] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/destinations');
                const data = response.data;

                // Sort by order
                const sortedData = data.sort((a, b) => a.order - b.order);

                setInternational(sortedData.filter(d => d.isInternational));
                setDomestic(sortedData.filter(d => !d.isInternational));
            } catch (error) {
                console.error("Failed to fetch destinations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
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

    // New state for category selection view
    const [showCategoryView, setShowCategoryView] = useState(true);

    // Handle category selection
    const handleCategorySelect = (category) => {
        setMobileTab(category);
        setShowCategoryView(false);
    };

    // Handle back to categories
    const handleBackToCategories = () => {
        setShowCategoryView(true);
    };

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

    /* ================== MOBILE ANIMATIONS ================== */
    useGSAP(() => {
        if (!isMobile) return;

        // Cleanup previous animations if any (auto-handled by useGSAP scope revert, but good to be explicit with contexts if needed)

        if (showCategoryView) {
            // CATEGORY VIEW ANIMATION
            // Use ScrollTrigger so it animates when user scrolls down to it
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".mobile-layout-container",
                    start: "top 85%", // Animate when top of container hits 85% of viewport
                    toggleActions: "play none none reverse" // Re-animate on scroll back? Or just play? 'play none none reverse' allows re-entry
                }
            });

            tl.fromTo(".mobile-dest-header",
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            )
                .fromTo(".category-card",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
                    "-=0.5"
                );

        } else {
            // CAROUSEL VIEW ANIMATION
            // Immediate animation since we are already in the section
            const tl = gsap.timeline();

            tl.fromTo(".mobile-dest-nav-header",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            )
                .fromTo(".mobile-dest-card",
                    { x: 100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
                    "-=0.3"
                )
                .fromTo(".mobile-swipe-hint",
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, delay: 0.5 },
                    "<"
                );
        }

    }, { dependencies: [showCategoryView, isMobile], scope: internalSectionRef });

    /* ================== SCROLL + ENTRY (DESKTOP) ================== */
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

        // Use matchMedia for reliable viewport-based logic
        const mm = gsap.matchMedia();

        // Desktop ONLY - Pinning and entry animations
        mm.add("(min-width: 769px)", () => {
            // Pinning/Scroll Logic - ONLY on desktop
            ScrollTrigger.create({
                trigger: internalSectionRef.current,
                start: "top top",
                end: "bottom top",
                pin: true,
                // scrub: true, // Not needed for pinning only
                onLeave: () => resetToInitialState(),
                onLeaveBack: () => resetToInitialState()
            });

            // Entry Animation - Desktop only
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: internalSectionRef.current,
                    start: "top bottom-=100",
                    end: "center center",
                    toggleActions: "play none none none"
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
        });

        // Mobile - No pinning, no entry animations
        mm.add("(max-width: 768px)", () => {
            // Ensure no ScrollTrigger effects on mobile
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === internalSectionRef.current) {
                    st.kill();
                }
            });
        });

        return () => mm.revert();

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
        // Navigate to state explorer page using React Router
        if (activePlace) {
            navigate(`/explore/${encodeURIComponent(activePlace.name)}`);
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
                    <div className="mobile-layout-container">
                        {showCategoryView ? (
                            /* ===== CATEGORY SELECTION VIEW ===== */
                            <>
                                {/* Header */}
                                <div className="mobile-dest-header">
                                    <span className="mobile-dest-tag">Your Journey Awaits</span>
                                    <h2 className="mobile-dest-title">Where Would You Like To Go?</h2>
                                </div>

                                {/* Category Cards */}
                                <div className="mobile-category-cards">
                                    {/* International Card */}
                                    <div
                                        className="category-card international"
                                        onClick={() => handleCategorySelect('international')}
                                    >
                                        <div className="category-card-bg">
                                            <img
                                                src={getOptimizedUrl("https://ik.imagekit.io/tsxbvz4jb6/Laymans/Dubai.webp", 600)}
                                                alt="International"
                                                loading="lazy"
                                            />
                                            <div className="category-overlay"></div>
                                        </div>
                                        <div className="category-card-content">
                                            <span className="category-icon">🌏</span>
                                            <h3>International</h3>
                                            <p>{international.length} Destinations</p>
                                            <div className="category-explore">
                                                <span>Explore</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Domestic Card */}
                                    <div
                                        className="category-card domestic"
                                        onClick={() => handleCategorySelect('domestic')}
                                    >
                                        <div className="category-card-bg">
                                            <img
                                                src={getOptimizedUrl("https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp", 600)}
                                                alt="Domestic"
                                                loading="lazy"
                                            />
                                            <div className="category-overlay"></div>
                                        </div>
                                        <div className="category-card-content">
                                            <span className="category-icon">🇮🇳</span>
                                            <h3>Domestic</h3>
                                            <p>{domestic.length} Hidden Gems</p>
                                            <div className="category-explore">
                                                <span>Explore</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ===== DESTINATION CAROUSEL VIEW ===== */
                            <>
                                {/* Back Header */}
                                <div className="mobile-dest-nav-header">
                                    <button className="back-btn" onClick={handleBackToCategories}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                        <span>Back</span>
                                    </button>
                                    <h3 className="nav-title">{mobileTab === 'international' ? 'International' : 'Domestic'}</h3>
                                    <span className="nav-count">{currentList.length} Places</span>
                                </div>

                                {/* Destination Carousel */}
                                <div className="mobile-carousel-wrapper">
                                    <div className="mobile-carousel">
                                        {currentList.map((d, index) => (
                                            <div
                                                key={d.name}
                                                className="mobile-dest-card"
                                                onClick={() => navigate(`/explore/${encodeURIComponent(d.name)}`)}
                                            >
                                                {/* Card Image */}
                                                <div className="mobile-card-image">
                                                    <img
                                                        src={getOptimizedUrl(d.image, 600)}
                                                        alt={d.name}
                                                        loading="lazy"
                                                    />
                                                    <div className="mobile-card-gradient"></div>
                                                    {d.badge && <span className="mobile-card-badge">{d.badge}</span>}
                                                </div>

                                                {/* Card Content */}
                                                <div className="mobile-card-content">
                                                    <h3>{d.name}</h3>
                                                    <p>{d.description}</p>

                                                    {/* Package Quick Info */}
                                                    <div className="package-quick-info">
                                                        <div className="info-item">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12,6 12,12 16,14" />
                                                            </svg>
                                                            <span>{mobileTab === 'international' ? '4-7 Days' : '2-4 Days'}</span>
                                                        </div>
                                                        <div className="info-item">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                            </svg>
                                                            <span>{mobileTab === 'international' ? 'Flight Incl.' : 'Customizable'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Explore Button */}
                                                    <div className="mobile-card-explore">
                                                        <span>View Packages</span>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Swipe Hint */}
                                <div className="mobile-swipe-hint">
                                    <span>← Swipe to explore →</span>
                                </div>
                            </>
                        )}
                    </div>
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