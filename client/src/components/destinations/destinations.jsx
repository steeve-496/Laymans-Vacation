import React, { useRef, useEffect, useState, forwardRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Stars from "./Stars";
import "./destinations.css";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import api from "../../utils/api";

const Globe = React.lazy(() => import("react-globe.gl"));

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_VIEW = { altitude: 2.5 };

const Destinations = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const globeRef = useRef(null);
    const selectionTimeline = useRef(null);

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
    // View State for Glass Slider: 'international' | 'stacked' | 'domestic'
    const [viewState, setViewState] = useState('stacked');

    const handleCategorySelect = (category) => {
        if (!isMobile) return;
        setMobileTab(category);
        setShowCategoryView(false);
    };

    // Handle back to categories
    // Handle back to categories
    const handleBackToCategories = () => {
        setShowCategoryView(true);
    };

    // Get Active List based on Mobile Tab
    const currentList = mobileTab === "international" ? international : domestic;

    /* ================== CAROUSEL DOTS LOGIC ================== */
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const mobileCarouselRef = useRef(null);

    const handleCarouselScroll = () => {
        if (mobileCarouselRef.current) {
            const scrollLeft = mobileCarouselRef.current.scrollLeft;
            // Center point logic
            const center = scrollLeft + (mobileCarouselRef.current.offsetWidth / 2);

            // Find which card is closest to center
            const index = Math.round(scrollLeft / (mobileCarouselRef.current.children[0].offsetWidth + 20)); // 20 is gap
            // Clamp index
            const safeIndex = Math.min(Math.max(0, index), currentList.length - 1);
            setActiveCardIndex(safeIndex);
        }
    };

    const scrollToCard = (index) => {
        if (mobileCarouselRef.current) {
            const card = mobileCarouselRef.current.children[index];
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                setActiveCardIndex(index);
            }
        }
    };

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

    /* ================== MOBILE PILLAR RADIANCE ================== */
    useGSAP(() => {
        if (!isMobile || !internalSectionRef.current) return;

        if (showCategoryView) {
            // Stack Entrance (Optional - presently just mounts)
            // Could add stack specific entry here if needed
        } else {
            // CAROUSEL ENTRANCE
            const tl = gsap.timeline();

            tl.fromTo(".dest-mobile-nav-header",
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
            )
                .fromTo(".mobile-dest-card",
                    { x: 50, opacity: 0, scale: 0.9 },
                    { x: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" },
                    "-=0.3"
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
                { x: -120, opacity: 1 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            )
                .fromTo(".dest-panel.right",
                    { x: 120, opacity: 1 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out"
                    }, "<");
        });

        // Mobile - No ScrollTrigger
        mm.add("(max-width: 768px)", () => {
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
        const startX = width * 0.25; // Center of Globe area
        const startY = height * 0.5;

        const cardWidth = 320;
        const marginRight = 150;
        const paddingRight = 0.15 * width;

        const endX = (width - paddingRight - marginRight - cardWidth) + 20;
        const endY = height * 0.5;

        const controlX = (startX + endX) / 2;
        const controlY = startY - (height * 0.2); // Arc height

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

    /* ================== NAVIGATE TO EXPLORER ================== */
    const handleExploreClick = () => {
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
            className={`destinations-section ${isMobile ? 'dest-mobile-view' : ''}`}
            ref={internalSectionRef}
        >
            {
                isMobile ? (
                    /* ================= MOBILE LAYOUT ================= */
                    <div className="dest-mobile-layout-container">
                        {showCategoryView ? (
                            /* ===== CATEGORY SELECTION VIEW ===== */
                            <>
                                {/* ===== CATEGORY SELECTION VIEW (SLIDER CONTROLLED) ===== */}
                                <div className="category-selection-view">
                                    {/* Header */}
                                    <div className="cat-header">
                                        <h1 className="cat-title">Explore new horizons</h1>

                                        {/* Marquee Ticker */}
                                        <div className="cat-marquee-container">
                                            <div className="cat-marquee-content">
                                                {[...international, ...domestic].map(d => d.name).concat([...international, ...domestic].map(d => d.name)).map((name, i) => (
                                                    <span key={i} className="cat-marquee-item">{name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Stack Container */}
                                    <div className={`cat-stack-container view-${viewState}`}>
                                        {/* International Card */}
                                        <div
                                            className="cat-stack-card card-int"
                                            onClick={() => {
                                                if (viewState === 'international') handleCategorySelect('international');
                                                else setViewState('international');
                                            }}
                                        >
                                            <div className="cat-card-image">
                                                <img
                                                    src={getOptimizedUrl("https://ik.imagekit.io/tsxbvz4jb6/Laymans/Dubai.webp", 800)}
                                                    alt="International"
                                                />
                                                <div className="cat-card-overlay"></div>
                                            </div>
                                            <div className="cat-card-content">
                                                <span className="cat-card-label">BEYOND BORDERS</span>
                                                <h2 className="cat-card-title">International</h2>
                                                <div className="cat-card-btn">Explore</div>
                                            </div>
                                        </div>

                                        {/* Domestic Card */}
                                        <div
                                            className="cat-stack-card card-dom"
                                            onClick={() => {
                                                if (viewState === 'domestic') handleCategorySelect('domestic');
                                                else setViewState('domestic');
                                            }}
                                        >
                                            <div className="cat-card-image">
                                                <img
                                                    src={getOptimizedUrl("https://ik.imagekit.io/tsxbvz4jb6/Laymans/munnar.webp", 800)}
                                                    alt="Domestic"
                                                />
                                                <div className="cat-card-overlay"></div>
                                            </div>
                                            <div className="cat-card-content">
                                                <span className="cat-card-label">WITHIN BORDERS</span>
                                                <h2 className="cat-card-title">Domestic</h2>
                                                <div className="cat-card-btn">Explore</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glassmorphism Bottom Slider */}
                                    <div className="glass-control-wrapper">
                                        <div className="glass-slider-track">
                                            {/* Background Active Indicator (The "Thumb" or Highlight) */}
                                            <div className={`slider-active-indicator pos-${viewState}`}></div>

                                            {/* Clickable Zones */}
                                            <div
                                                className={`slider-zone left ${viewState === 'international' ? 'active' : ''}`}
                                                onClick={() => setViewState('international')}
                                            >
                                                {/* Globe Icon */}
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            </div>

                                            <div
                                                className={`slider-zone center ${viewState === 'stacked' ? 'active' : ''}`}
                                                onClick={() => setViewState('stacked')}
                                            >
                                                {/* Plane Icon */}
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 2L11 13" />
                                                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                                                </svg>
                                            </div>

                                            <div
                                                className={`slider-zone right ${viewState === 'domestic' ? 'active' : ''}`}
                                                onClick={() => setViewState('domestic')}
                                            >
                                                {/* India Map Mask */}
                                                <div className="india-icon-mask"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ===== DESTINATION CAROUSEL VIEW ===== */
                            <>
                                {/* ===== DESTINATION CAROUSEL VIEW (EXPLORE STYLE) ===== */}
                                <div className="explore-view-container">
                                    {/* Header */}
                                    <div className="explore-header-area">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h1 className="explore-title">Explore</h1>
                                            {/* Hidden Back Trigger for usability */}
                                            <button
                                                onClick={handleBackToCategories}
                                                style={{ background: 'none', border: 'none', padding: '10px', fontSize: '1.5rem', color: '#1e293b' }}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="explore-dots">
                                            {currentList.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`explore-dot ${activeCardIndex === idx ? 'active' : ''}`}
                                                    onClick={() => scrollToCard(idx)}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cards Carousel */}
                                    <div className="dest-mobile-carousel-wrapper explore-mode">
                                        <div
                                            className="dest-mobile-carousel explore-mode-list"
                                            data-lenis-prevent
                                            ref={mobileCarouselRef}
                                            onScroll={handleCarouselScroll}
                                        >
                                            {currentList.map((d, index) => (
                                                <div
                                                    key={d.name}
                                                    className="explore-card"
                                                    onClick={() => navigate(`/explore/${encodeURIComponent(d.name)}`)}
                                                >
                                                    <div className="explore-card-image">
                                                        <img
                                                            src={getOptimizedUrl(d.image, 600)}
                                                            alt={d.name}
                                                            loading="lazy"
                                                        />
                                                        <div className="explore-card-gradient"></div>
                                                    </div>

                                                    {/* Badge at Top Right */}
                                                    {d.badge && <span className="explore-card-badge-top-right">{d.badge}</span>}

                                                    {/* Title & Description */}
                                                    <div className="explore-card-content-top">
                                                        <h2 className="explore-card-title">{d.name}</h2>
                                                        <p className="explore-card-subtitle">
                                                            {d.description ? (d.description.length > 35 ? d.description.substring(0, 35) + "..." : d.description) : "Explore"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Map Background & Animation */}
                                    <div className="explore-map-bg">
                                        <svg className="explore-route-svg" viewBox="0 0 375 500" preserveAspectRatio="xMidYMax slice">
                                            {/* Map Roads (Background) */}
                                            <path
                                                d="M-50,400 L100,350 L200,450 L350,400 L450,450"
                                                stroke="#cbd5e1"
                                                strokeWidth="8"
                                                fill="none"
                                                opacity="0.5"
                                            />
                                            <path
                                                d="M50,550 L100,350 L50,150 L200,50"
                                                stroke="#cbd5e1"
                                                strokeWidth="8"
                                                fill="none"
                                                opacity="0.5"
                                            />
                                            <path
                                                d="M300,550 L350,400 L250,250 L400,100"
                                                stroke="#cbd5e1"
                                                strokeWidth="8"
                                                fill="none"
                                                opacity="0.5"
                                            />

                                            {/* Animated Route */}
                                            <path
                                                className="explore-route-path"
                                                d="M50,500 C100,480 80,420 120,380 S200,400 240,350 S300,300 320,280"
                                                stroke="#0ea5e9"
                                                strokeWidth="6"
                                                fill="none"
                                                strokeLinecap="round"
                                            />

                                            {/* Start Point */}
                                            <circle cx="50" cy="500" r="8" fill="#0ea5e9" stroke="#fff" strokeWidth="3" />

                                            {/* End Point Ripple */}
                                            <circle cx="320" cy="280" r="12" fill="rgba(14, 165, 233, 0.2)" />
                                            <circle cx="320" cy="280" r="6" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />

                                            {/* Location Label Mockup */}
                                            <g transform="translate(240, 320)">
                                                <text x="0" y="0" fill="#64748b" fontFamily="Inter" fontSize="10" fontWeight="500">Your location</text>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* ================= DESKTOP LAYOUT (UPDATED) ================= */
                    <>
                        {/* LEFT PANEL */}
                        <aside className={`dest-panel left ${cardVisible ? 'dest-faded' : ''}`}>
                            <div className="dest-panel-header">
                                <span className="dest-panel-tag">Explore</span>
                                <h4 className="dest-panel-title">International</h4>
                            </div>

                            <ul className="dest-panel-list" data-lenis-prevent>
                                {international.map(d => (
                                    <li key={d.name} onClick={() => handleSelect(d)}>
                                        <div className="dest-li-content">
                                            <span className="dest-country-name">{d.name}</span>
                                            {d.badge && <span className="dest-badge">{d.badge}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* RIGHT PANEL */}
                        <aside className={`dest-panel right ${cardVisible ? 'dest-faded' : ''}`}>
                            <div className="dest-panel-header">
                                <span className="dest-panel-tag">Discover</span>
                                <h4 className="dest-panel-title">Domestic</h4>
                            </div>

                            <ul className="dest-panel-list" data-lenis-prevent>
                                {domestic.map(d => (
                                    <li key={d.name} onClick={() => handleSelect(d)}>
                                        <div className="dest-li-content">
                                            <span className="dest-country-name">{d.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* GLOBE */}
                        <div className={`dest-globe-wrap ${cardVisible ? 'dest-dimmed' : ''}`} ref={containerRef}>
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
