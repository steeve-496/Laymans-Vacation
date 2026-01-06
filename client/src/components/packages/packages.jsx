// Trigger HMR
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./packages.css";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import api from "../../utils/api";



const ContactForm = ({ onClose }) => {
    return (
        <div className="pkg-form-overlay">
            <div className="pkg-contact-form">
                <button className="pkg-close-form-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <h3>Unlock Your Journey</h3>
                <p>Enter your details to view the full itinerary and get exclusive offers.</p>
                <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div className="pkg-form-group">
                        <input type="text" placeholder="Your Name" required />
                    </div>
                    <div className="pkg-form-group">
                        <input type="email" placeholder="Email Address" required />
                    </div>
                    <div className="pkg-form-group">
                        <input type="tel" placeholder="Phone Number" required />
                    </div>
                    <div className="pkg-form-row">
                        <div className="pkg-form-group">
                            <input type="number" placeholder="Adults" min="1" required />
                        </div>
                        <div className="pkg-form-group">
                            <input type="number" placeholder="Children" min="0" />
                            <span className="pkg-info-text">Under 5 years free</span>
                        </div>
                    </div>
                    <div className="pkg-form-group">
                        <input type="date" placeholder="Day of Journey" required />
                    </div>
                    <button type="submit" className="pkg-submit-btn">View Itinerary</button>
                </form>
            </div>
        </div>
    );
};

const ItineraryModal = ({ pkg, originRect, onClose, showForm }) => {
    const modalRef = useRef(null);
    const contentRef = useRef(null);
    const placeholderRef = useRef(null);
    const [isFormVisible, setIsFormVisible] = useState(showForm);

    useGSAP(() => {
        if (!originRect || !modalRef.current) return;

        const tl = gsap.timeline({
            onReverseComplete: onClose
        });

        // Initial State (match button)
        gsap.set(modalRef.current, {
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            borderRadius: "0px",
            opacity: 1,
            backgroundColor: "#fff"
        });

        gsap.set(contentRef.current, { opacity: 0 });
        gsap.set(placeholderRef.current, { opacity: 1 });

        tl.to(modalRef.current, {
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 0.8,
            ease: "expo.inOut"
        });

        tl.to(placeholderRef.current, {
            opacity: 0,
            duration: 0.3
        }, "-=0.6");

        tl.to(contentRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4");

        // Store timeline for reverse
        modalRef.current.tl = tl;

    }, [originRect]);

    const handleClose = () => {
        if (modalRef.current && modalRef.current.tl) {
            modalRef.current.tl.reverse();
        } else {
            onClose();
        }
    };

    if (!pkg) return null;

    // Use Portal to escape parent transforms
    return createPortal(
        <div className="pkg-itinerary-modal" ref={modalRef}>
            {/* Placeholder that mimics the button */}
            <div
                ref={placeholderRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    pointerEvents: "none",
                    color: "#000"
                }}
            >
                VIEW ITINERARY
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>

            {/* Actual Content */}
            <div className={`pkg-modal-content ${isFormVisible ? 'pkg-blurred' : ''}`} ref={contentRef}>
                <div className="pkg-modal-header">
                    <div className="pkg-modal-title">
                        <h2>{pkg.title}</h2>
                        <div className="pkg-modal-meta">
                            <span>{pkg.duration}</span>
                            <span>•</span>
                            <span>{pkg.price}</span>
                        </div>
                    </div>
                    <button className="pkg-close-modal-btn" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="pkg-modal-body">
                    <div className="pkg-modal-left">
                        <img
                            src={getOptimizedUrl(pkg.image, 800)}
                            alt={pkg.title}
                            className="pkg-modal-image"
                        />
                    </div>
                    <div className="pkg-modal-right">
                        <div className="pkg-day-list">
                            {pkg.details?.itinerary && pkg.details.itinerary.map((item, index, arr) => (
                                <div key={item.day} className="pkg-day-item">
                                    <div className="pkg-timeline-column">
                                        <div className="pkg-timeline-dot"></div>
                                        {index !== arr.length - 1 && <div className="pkg-timeline-line"></div>}
                                    </div>
                                    <div className="pkg-day-info">
                                        <span className="pkg-day-number">Day {item.day}</span>
                                        <div className="pkg-day-content">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <ContactForm onClose={() => setIsFormVisible(false)} />
            )}
        </div>,
        document.body
    );
};

const Packages = forwardRef(({ location, country, onBack }, ref) => {
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    // Modal State
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [originRect, setOriginRect] = useState(null);
    const [hasFormShown, setHasFormShown] = useState(false);
    const [showFormInModal, setShowFormInModal] = useState(false);

    // Use country for image lookup, fallback to location if country not provided
    const imageKey = country || location;

    // Dynamic Data State
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            if (!location) return;
            try {
                // Fetch all packages and filter locally (or could fetch by destinationId if available)
                // Since we only have location name here, we will fetch key "destinations" -> find id -> fetch packages
                // OR simpler: fetch all packages and filter by title/logic.
                // BEST: Fetch all, filter by matching destination name (or pass dest ID)
                // For now, let's assume we can fetch all and filter by `location` string in title?
                // Actually, the SEED data linked packages to Destination ID.
                // Frontend only knows location NAME here.
                // We should probably fetch the destination first to get ID, then packages.
                // OR: just fetch all packages and filter where title includes location or destination.name matches.

                // Let's rely on retrieving the destination by name to get its ID, then filter packages.
                // Optimized approach: API endpoint to get packages by destination name?
                // Let's stick to client-side filter for speed if dataset is small.

                // Fetch Destinations to map name -> ID (or just matching logic)
                const destRes = await api.get('/destinations');
                const currentDest = destRes.data.find(d => d.name === location);

                if (currentDest) {
                    const pkgRes = await api.get('/packages');
                    const filteredPkgs = pkgRes.data
                        .filter(p => p.destinationId === currentDest.id)
                        .sort((a, b) => a.order - b.order); // Sort by order

                    setPackages(filteredPkgs);
                } else {
                    console.warn("Destination not found for packages:", location);
                    setPackages([]);
                }

            } catch (error) {
                console.error("Failed to fetch packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [location]);

    // Horizontal Scroll Animation (Entry)
    useGSAP(() => {
        const cards = gsap.utils.toArray(".pkg-carousel-card");

        gsap.from(cards, {
            x: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2
        });
    }, { scope: containerRef });

    // Drag Handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        containerRef.current.style.cursor = 'grabbing';
        // Disable snap during drag for smoothness
        containerRef.current.style.scrollSnapType = 'none';
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (containerRef.current) {
                containerRef.current.style.cursor = 'grab';
                containerRef.current.style.scrollSnapType = 'x mandatory';
            }
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            if (containerRef.current) {
                containerRef.current.style.cursor = 'grab';
                containerRef.current.style.scrollSnapType = 'x mandatory';
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Scroll Spy for Bottom Navigation
    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollPosition = containerRef.current.scrollLeft;
        const containerWidth = containerRef.current.offsetWidth;
        // Calculate index based on center of view
        const index = Math.round(scrollPosition / (containerWidth * 0.8)); // 0.8 is approx card width ratio
        // Clamp index
        const clampedIndex = Math.min(Math.max(index, 0), packages.length - 1);
        if (clampedIndex !== activeIndex) {
            setActiveIndex(clampedIndex);
        }
    };

    const scrollToPackage = (index) => {
        if (!containerRef.current) return;
        const card = containerRef.current.children[0].children[index]; // Accessing via track -> card
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    const handleViewItinerary = (e, pkg) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setOriginRect(rect);
        setSelectedPackage(pkg);

        if (!hasFormShown) {
            setShowFormInModal(true);
            setHasFormShown(true);
        } else {
            setShowFormInModal(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedPackage(null);
        setOriginRect(null);
    };

    const activePackage = packages[activeIndex];

    return (
        <section
            className="pkg-section"
            ref={ref}
            style={{
                backgroundImage: `url(${getOptimizedUrl(activePackage?.image, 1200)})`
            }}
        >
            <div className="pkg-backdrop-blur"></div>
            <div className="pkg-connecting-line"></div>

            <div
                className="pkg-carousel-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onScroll={handleScroll}
            >
                <div className="pkg-carousel-track" ref={scrollContainerRef}>
                    {packages.map((pkg, index) => (
                        <div key={pkg.id} className="pkg-carousel-card">
                            <div className="pkg-card-image-wrapper">
                                <img
                                    src={getOptimizedUrl(pkg.image, 1200)}
                                    alt={pkg.title}
                                    draggable="false" // Prevent image drag
                                />
                                <div className="pkg-card-overlay"></div>
                            </div>

                            <div className="pkg-card-content-top">
                                <span className="pkg-journey-label">{pkg.category} JOURNEY</span>
                                <h2 className="pkg-card-title">{pkg.title}</h2>
                            </div>

                            <div className="pkg-card-content-bottom">
                                <div className="pkg-details-box">
                                    <div className="pkg-details-header">
                                        <span>{pkg.duration}</span>
                                        <span className="price">{pkg.price}</span>
                                    </div>
                                    <h3>{pkg.title}</h3>
                                    <p>{pkg.description}</p>
                                    <button
                                        className="pkg-view-btn"
                                        style={{ opacity: selectedPackage?.id === pkg.id ? 0 : 1 }}
                                        onClick={(e) => handleViewItinerary(e, pkg)}
                                    >
                                        VIEW ITINERARY
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pkg-nav">
                {packages.map((pkg, index) => (
                    <button
                        key={pkg.id}
                        className={`pkg-nav-item ${index === activeIndex ? 'pkg-active' : ''}`}
                        onClick={() => scrollToPackage(index)}
                    >
                        {pkg.navTitle}
                    </button>
                ))}
            </div>

            {/* Back Button - Redesigned */}
            <div className="pkg-back-btn" onClick={onBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="pkg-back-text">BACK</span>
            </div>

            {/* Itinerary Modal */}
            {selectedPackage && (
                <ItineraryModal
                    pkg={selectedPackage}
                    originRect={originRect}
                    onClose={handleCloseModal}
                    showForm={showFormInModal}
                />
            )}
        </section>
    );
});

export default Packages;
