// Trigger HMR
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./packages.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PACKAGE_TIER_IMAGES } from "../../data/packageImages";

const getPackageImage = (location, category) => {
    const key = (location || "").trim();
    return (
        PACKAGE_TIER_IMAGES[key]?.[category] ||
        PACKAGE_TIER_IMAGES.default?.[category] ||
        PACKAGE_TIER_IMAGES.default.Basic
    );
};

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
                            src={optimizeCloudinaryUrl(pkg.image, 800)}
                            alt={pkg.title}
                            className="pkg-modal-image"
                        />
                    </div>
                    <div className="pkg-modal-right">
                        <div className="pkg-day-list">
                            {pkg.itinerary && pkg.itinerary.map((item, index, arr) => (
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

const Packages = forwardRef(({ location, onBack }, ref) => {
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

    const packages = [
        {
            id: 1,
            category: "Basic",
            navTitle: "The Glimpse",
            title: `Best of ${location}`,
            price: "Rs 25,000",
            image: getPackageImage(location, "Basic"),
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
            id: 4,
            category: "Getaway",
            navTitle: "The Escape",
            title: `Romantic ${location}`,
            price: "Rs 80,000",
            image: getPackageImage(location, "Getaway"),
            duration: "6 Days",
            description: "Perfect for couples. Sunsets, private dinners, and beautiful views.",
            itinerary: [
                { day: 1, title: "Romantic Arrival", description: "Private transfer to your luxury resort. Champagne welcome and sunset dinner on the beach." },
                { day: 2, title: "Private Island Tour", description: "Exclusive boat tour to secluded islands. Snorkeling and private beach picnic." },
                { day: 3, title: "Spa Day", description: "Indulge in a couples' spa treatment followed by a relaxing afternoon by the infinity pool." },
                { day: 4, title: "Sunset Cruise", description: "Evening yacht cruise with cocktails and canapés, watching the sun dip below the horizon." },
                { day: 5, title: "Candlelit Dinner", description: "A special 5-course dinner under the stars at a renowned cliffside restaurant." },
                { day: 6, title: "Farewell", description: "Breakfast in bed and private transfer to the airport." }
            ]
        },
        {
            id: 2,
            category: "Adventure",
            navTitle: "The Voyage",
            title: `${location} Adventure`,
            price: "Rs 1,00,000",
            image: getPackageImage(location, "Adventure"),
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
            id: 3,
            category: "Luxury",
            navTitle: "The Odyssey",
            title: `Luxury ${location}`,
            price: "Rs 2,50,000",
            image: getPackageImage(location, "Luxury"),
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

    return (
        <section className="pkg-section" ref={ref}>
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
                                    src={optimizeCloudinaryUrl(pkg.image, 1200)}
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
