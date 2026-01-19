// Trigger HMR
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./packages.css";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import api from "../../utils/api";


import { PACKAGE_TIER_IMAGES } from "../../data/packageImages";
const ContactForm = ({ onClose, packageTitle }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        adults: 1,
        children: 0,
        travelDate: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/inquiries", {
                ...formData,
                packageTitle
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit inquiry. Please try again.");
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="pkg-form-overlay">
                <div className="pkg-contact-form">
                    <div className="pkg-success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>Your inquiry for <strong>{packageTitle}</strong> has been received. We'll get back to you shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pkg-form-overlay">
            <div className="pkg-contact-form">
                <button className="pkg-close-form-btn" onClick={onClose} disabled={submitting}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <h3>Unlock {packageTitle}</h3>
                <p>Enter your details to view the full itinerary and get exclusive offers.</p>
                <form onSubmit={handleSubmit}>
                    <div className="pkg-form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="pkg-form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="pkg-form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="pkg-form-row">
                        <div className="pkg-form-group">
                            <input
                                type="number"
                                name="adults"
                                placeholder="Adults"
                                min="1"
                                value={formData.adults}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="pkg-form-group">
                            <input
                                type="number"
                                name="children"
                                placeholder="Children"
                                min="0"
                                value={formData.children}
                                onChange={handleChange}
                            />
                            <span className="pkg-info-text">Under 5 years free</span>
                        </div>
                    </div>
                    <div className="pkg-form-group">
                        <input
                            type="date"
                            name="travelDate"
                            placeholder="Day of Journey"
                            value={formData.travelDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="pkg-submit-btn" disabled={submitting}>
                        {submitting ? "Processing..." : "View Itinerary"}
                    </button>
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
                        {pkg.details?.itineraryDestinations && (
                            <div className="pkg-itinerary-destinations" style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                marginTop: '5px',
                                fontWeight: 500
                            }}>
                                {pkg.details.itineraryDestinations}
                            </div>
                        )}
                    </div>
                    <div className="pkg-header-actions">
                        <button className="pkg-book-now-btn" onClick={() => setIsFormVisible(true)}>
                            Book Now
                        </button>
                        <button className="pkg-close-modal-btn" onClick={handleClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="pkg-modal-body" data-lenis-prevent>
                    <div className="pkg-modal-left">
                        <img
                            src={getOptimizedUrl(pkg.image, 800)}
                            alt={pkg.title}
                            className="pkg-modal-image"
                        />
                    </div>
                    <div className="pkg-modal-right">
                        <h3 className="pkg-section-title">Daily Itinerary</h3>
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

                                            {/* Activities List */}
                                            {Array.isArray(item.activities) && item.activities.length > 0 ? (
                                                <ul className="pkg-activity-list">
                                                    {item.activities.map((act, i) => {
                                                        const isSub = act.startsWith(' ') || act.startsWith('\t');
                                                        return (
                                                            <li
                                                                key={i}
                                                                className={isSub ? "pkg-activity-sub" : ""}
                                                                style={isSub ? { marginLeft: '20px', listStyleType: 'circle' } : {}}
                                                            >
                                                                {act.trim()}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p>{item.description}</p>
                                            )}

                                            {/* Meals & Stay */}
                                            {(item.meals || item.stay) && (
                                                <div className="pkg-day-extras">
                                                    {item.meals && (
                                                        <div className="pkg-extra-item">
                                                            <span className="pkg-extra-icon">🍽️</span>
                                                            <span>{item.meals}</span>
                                                        </div>
                                                    )}
                                                    {item.stay && (
                                                        <div className="pkg-extra-item">
                                                            <span className="pkg-extra-icon">🏨</span>
                                                            <span>{item.stay}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <ContactForm onClose={() => setIsFormVisible(false)} packageTitle={pkg.title} />
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
            setLoading(true);
            try {
                // 1. Fetch Destinations first to get the ID (Cached)
                const destRes = await api.getCached('/destinations');

                let currentDest = destRes.data.find(d => d.name === location);
                if (!currentDest && country && location !== country) {
                    currentDest = destRes.data.find(d => d.name === country);
                }

                if (currentDest) {
                    // 2. Fetch Packages filtered by destinationId (Cached)
                    const pkgRes = await api.getCached('/packages', {
                        params: { destinationId: currentDest.id }
                    });

                    // Server now filters, so allow all returned (just sort)
                    const filteredPkgs = pkgRes.data.sort((a, b) => a.order - b.order);

                    const processedPkgs = filteredPkgs.map(pkg => {
                        let category = pkg.category;
                        if (!category && pkg.title) {
                            if (pkg.title.includes('Basic')) category = 'Basic';
                            else if (pkg.title.includes('Getaway')) category = 'Getaway';
                            else if (pkg.title.includes('Adventure')) category = 'Adventure';
                            else if (pkg.title.includes('Luxury')) category = 'Luxury';
                        }
                        if (!category) category = 'Basic';

                        const imageLocationKey = PACKAGE_TIER_IMAGES[location] ? location : (currentDest.name || 'default');
                        const countryImages = PACKAGE_TIER_IMAGES[imageLocationKey] || PACKAGE_TIER_IMAGES['default'];
                        const staticImage = countryImages[category] || countryImages['Basic'];

                        return {
                            ...pkg,
                            image: staticImage
                        };
                    });

                    setPackages(processedPkgs);
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
    }, [location, country]);

    // Horizontal Scroll Animation (Entry)
    useGSAP(() => {
        if (packages.length === 0) return;

        const cards = gsap.utils.toArray(".pkg-carousel-card");
        if (cards.length === 0) return;

        gsap.fromTo(cards,
            {
                x: 100,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.2,
                clearProps: "all" // Ensure cleanup after animation
            }
        );
    }, { scope: containerRef, dependencies: [packages] });

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

    if (loading) {
        return (
            <section className="pkg-section pkg-skeleton">
                <div className="pkg-backdrop-blur"></div>
                <div className="pkg-carousel-container">
                    <div className="pkg-carousel-track">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="pkg-carousel-card skeleton-card">
                                <div className="pkg-card-image-wrapper skeleton-pulse" />
                                <div className="pkg-card-content-top">
                                    <div className="skeleton-line label" />
                                    <div className="skeleton-line title" />
                                </div>
                                <div className="pkg-card-content-bottom">
                                    <div className="pkg-details-box skeleton-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

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
                                        <span className="pkg-price">{pkg.price}</span>
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
