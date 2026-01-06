import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./state-explorer.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

import { getOptimizedUrl } from "../../utils/imageOptimizer";

import api from "../../utils/api";

const StateExplorer = () => {
    const { country } = useParams();
    const navigate = useNavigate();
    const selectedCountry = country || "Azerbaijan";

    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const sliderTrackRef = useRef(null);
    const cardRef = useRef(null);
    const bgRef = useRef(null);
    const isAnimating = useRef(false);

    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                // Fetch destination by name to get ID
                const destRes = await api.get('/destinations');
                const currentDest = destRes.data.find(d => d.name === selectedCountry);

                if (currentDest) {
                    const stateRes = await api.get('/state-explorer');
                    // Filter by matching destinationId (assumes backend returns all or specialized endpoint)
                    const filteredStates = stateRes.data
                        .filter(s => s.destinationId === currentDest.id)
                        .sort((a, b) => a.order - b.order);

                    if (filteredStates.length > 0) {
                        setStates(filteredStates);
                    } else {
                        // Fallback or empty? If empty, maybe show nothing or redirect.
                        // For now we assume seed data exists for "countries" in list.
                        console.warn(`No states found for ${selectedCountry}`);
                        setStates([]);
                    }
                } else {
                    console.warn(`Destination not found: ${selectedCountry}`);
                    setStates([]);
                }
            } catch (error) {
                console.error("Failed to fetch state explorer data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStates();
    }, [selectedCountry]);




    const totalStates = states.length;
    const currentState = states[activeIndex];

    // Handle back navigation - go to destinations section instantly
    const handleBack = () => {
        navigate("/?instant=true#destinations");
    };

    // Handle explore click - navigate to packages
    const handleExplore = () => {
        // Use the state name explicitly to find its packages
        navigate(`/packages/${selectedCountry}/${currentState.name}`);
    };

    // Change state with smooth animation
    const changeState = useCallback((newIndex, direction = 1) => {
        if (newIndex < 0 || newIndex >= totalStates || newIndex === activeIndex || isAnimating.current) return;

        isAnimating.current = true;
        const slideDirection = direction > 0 ? -1 : 1;

        // Check if mobile (screen width <= 992px)
        const isMobile = window.innerWidth <= 992;

        // Create timeline for smooth transitions with default smooth settings
        const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            onComplete: () => {
                isAnimating.current = false;
            }
        });

        if (isMobile) {
            tl.to(cardRef.current, {
                opacity: 0,
                y: slideDirection * 60,
                rotationX: slideDirection * 8,
                scale: 0.92,
                duration: 0.5,
                ease: "power2.inOut",
                transformPerspective: 1000,
                transformOrigin: "center center"
            });

            tl.to(bgRef.current, {
                opacity: 0,
                scale: 1.08,
                filter: "blur(8px)",
                duration: 0.4,
                ease: "power2.inOut"
            }, "-=0.4");

            tl.call(() => {
                setActiveIndex(newIndex);
            }, null, "-=0.1");
            tl.fromTo(bgRef.current,
                { opacity: 0, scale: 1.12, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" },
                "-=0.1"
            );

            // Card smooth flip in
            tl.fromTo(cardRef.current,
                {
                    opacity: 0,
                    y: -slideDirection * 60,
                    rotationX: -slideDirection * 8,
                    scale: 0.92
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "expo.out",
                    transformPerspective: 1000,
                    transformOrigin: "center center"
                },
                "-=0.6"
            );
        } else {
            // Desktop: Smooth crossfade with slide

            // Card fade out with subtle slide
            tl.to(cardRef.current, {
                opacity: 0,
                x: slideDirection * 60,
                scale: 0.96,
                duration: 0.5,
                ease: "circ.inOut"
            });

            // Background crossfade - starts earlier for overlap
            tl.to(bgRef.current, {
                opacity: 0,
                scale: 1.06,
                duration: 0.4,
                ease: "circ.inOut"
            }, "-=0.4");

            // Update state
            tl.call(() => {
                setActiveIndex(newIndex);
            }, null, "-=0.1");

            // Background fade in smoothly
            tl.fromTo(bgRef.current,
                { opacity: 0, scale: 1.08 },
                { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" },
                "-=0.1"
            );

            // Card slide in smoothly
            tl.fromTo(cardRef.current,
                { opacity: 0, x: -slideDirection * 60, scale: 0.96 },
                { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "expo.out" },
                "-=0.6"
            );

            // Update slider position with smooth animation
            if (sliderRef.current && sliderTrackRef.current) {
                const trackHeight = sliderTrackRef.current.offsetHeight;
                const maxY = trackHeight - 60;
                const newY = (newIndex / Math.max(totalStates - 1, 1)) * maxY;

                gsap.to(sliderRef.current, {
                    y: newY,
                    duration: 0.6,
                    ease: "expo.out"
                });
            }
        }
    }, [activeIndex, totalStates]);

    // Handle wheel event for lens-only navigation
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let wheelTimeout = null;
        let accumulatedDelta = 0;
        const threshold = 30; // Lower threshold for faster response
        let lastTriggerTime = 0;
        const cooldown = 400; // Cooldown between state changes to prevent rapid switching

        const handleWheel = (e) => {
            e.preventDefault();

            const now = Date.now();
            accumulatedDelta += e.deltaY;

            // Clear any pending timeout
            if (wheelTimeout) clearTimeout(wheelTimeout);

            // Check if enough delta accumulated and cooldown passed
            if (Math.abs(accumulatedDelta) > threshold && (now - lastTriggerTime) > cooldown) {
                const direction = accumulatedDelta > 0 ? 1 : -1;
                const newIndex = activeIndex + direction;

                if (newIndex >= 0 && newIndex < totalStates) {
                    changeState(newIndex, direction);
                    lastTriggerTime = now;
                }
                accumulatedDelta = 0;
            } else {
                // Reset accumulated delta after small delay if no action taken
                wheelTimeout = setTimeout(() => {
                    accumulatedDelta = 0;
                }, 150);
            }
        };

        section.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            section.removeEventListener('wheel', handleWheel);
            if (wheelTimeout) clearTimeout(wheelTimeout);
        };
    }, [activeIndex, totalStates, changeState]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                changeState(activeIndex + 1, 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                changeState(activeIndex - 1, -1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, changeState]);

    // Touch swipe support for mobile
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchMove = (e) => {
            // Prevent default scrolling behavior
            e.preventDefault();
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Check if horizontal or vertical swipe is more prominent
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX < 0) {
                        // Swipe left - next state
                        changeState(activeIndex + 1, 1);
                    } else {
                        // Swipe right - previous state
                        changeState(activeIndex - 1, -1);
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY < 0) {
                        // Swipe up - next state
                        changeState(activeIndex + 1, 1);
                    } else {
                        // Swipe down - previous state
                        changeState(activeIndex - 1, -1);
                    }
                }
            }
        };

        section.addEventListener('touchstart', handleTouchStart, { passive: true });
        section.addEventListener('touchmove', handleTouchMove, { passive: false });
        section.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            section.removeEventListener('touchstart', handleTouchStart);
            section.removeEventListener('touchmove', handleTouchMove);
            section.removeEventListener('touchend', handleTouchEnd);
        };
    }, [activeIndex, changeState]);

    // GSAP Draggable for lens slider
    useGSAP(() => {
        if (loading || states.length === 0 || !sliderRef.current || !sliderTrackRef.current || totalStates <= 1) return;

        const trackHeight = sliderTrackRef.current.offsetHeight;
        const maxY = trackHeight - 60;

        const draggable = Draggable.create(sliderRef.current, {
            type: "y",
            bounds: sliderTrackRef.current,
            inertia: true,
            edgeResistance: 0.8,
            snap: {
                y: (endValue) => {
                    const segmentHeight = maxY / (totalStates - 1);
                    const snappedIndex = Math.round(endValue / segmentHeight);
                    return snappedIndex * segmentHeight;
                }
            },
            onDragStart: function () {
                gsap.to(this.target, { scale: 1.1, duration: 0.2 });
            },
            onDrag: function () {
                // Calculate which state based on drag position
                const progress = this.y / maxY;
                const stateIndex = Math.round(progress * (totalStates - 1));

                // Highlight the scale number
                document.querySelectorAll('.se-scale-num').forEach((el, idx) => {
                    if (idx === stateIndex) {
                        el.classList.add('active');
                    } else {
                        el.classList.remove('active');
                    }
                });

                // Update track glow position
                gsap.set('.se-track-glow', { y: this.y });
            },
            onDragEnd: function () {
                gsap.to(this.target, { scale: 1, duration: 0.2 });

                const progress = this.y / maxY;
                const newIndex = Math.round(progress * (totalStates - 1));

                if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalStates) {
                    const direction = newIndex > activeIndex ? 1 : -1;

                    // Animate card content change
                    isAnimating.current = true;

                    gsap.to(cardRef.current, {
                        opacity: 0,
                        x: -direction * 50,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            setActiveIndex(newIndex);
                            gsap.fromTo(cardRef.current,
                                { opacity: 0, x: direction * 50 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.4,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        isAnimating.current = false;
                                    }
                                }
                            );
                        }
                    });

                    gsap.to(bgRef.current, {
                        opacity: 0,
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            gsap.fromTo(bgRef.current,
                                { opacity: 0, scale: 1.1 },
                                { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
                            );
                        }
                    });
                }
            }
        })[0];

        return () => {
            if (draggable) draggable.kill();
        };
    }, { scope: sectionRef, dependencies: [totalStates, activeIndex] });

    // Click on scale numbers to navigate
    const handleScaleClick = (index) => {
        if (index === activeIndex) return;
        const direction = index > activeIndex ? 1 : -1;
        changeState(index, direction);

        // Animate slider to position
        if (sliderRef.current && sliderTrackRef.current) {
            const trackHeight = sliderTrackRef.current.offsetHeight;
            const maxY = trackHeight - 60;
            const newY = (index / Math.max(totalStates - 1, 1)) * maxY;

            gsap.to(sliderRef.current, {
                y: newY,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    };

    // Entry animation
    // Entry animation
    useGSAP(() => {
        if (loading || states.length === 0 || !cardRef.current) return;

        const tl = gsap.timeline();

        tl.fromTo(cardRef.current,
            { opacity: 0, x: -100, scale: 0.9 },
            { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        );

        tl.fromTo(".se-lens-slider",
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );

        tl.fromTo(".se-sparkle",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
            "-=0.2"
        );
    }, { scope: sectionRef, dependencies: [loading, states.length] });

    // Use state names for the slider labels instead of numbers
    const scaleLabels = states.map(state => state.name);

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading Explorer...</div>;
    if (states.length === 0) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>No content available for {selectedCountry}.</div>;
    if (!currentState) return null;

    return (
        <section className="se-section" ref={sectionRef}>
            {/* Background Image */}
            <div
                className="se-bg-image"
                ref={bgRef}
                style={{ backgroundImage: `url(${getOptimizedUrl(currentState.image, 1920)})` }}
            />
            <div className="se-bg-overlay" />

            {/* Content Container */}
            <div className="se-content">
                {/* Main Card */}
                <div className="se-card" ref={cardRef}>
                    {/* Back Button */}
                    <button className="se-back-btn" onClick={handleBack}>
                        <span className="se-back-arrow">←</span>
                        <span>Back</span>
                    </button>

                    {/* Card Image */}
                    <div className="se-card-image">
                        <img
                            src={getOptimizedUrl(currentState.image, 1200)}
                            alt={currentState.name}
                            loading="lazy"
                        />
                        <div className="se-card-gradient" />
                    </div>

                    {/* Card Content */}
                    <div className="se-card-content">
                        <h1 className="se-card-title">{currentState.name.toUpperCase()}</h1>
                        <p className="se-card-description">{currentState.description}</p>
                        <button className="se-explore-btn" onClick={handleExplore}>
                            Click to Explore
                        </button>
                    </div>
                </div>

                {/* Lens Slider Control */}
                <div className="se-lens-slider">
                    {/* Scale Labels - State Names */}
                    <div className="se-scale-numbers">
                        {scaleLabels.map((name, idx) => (
                            <span
                                key={idx}
                                className={`se-scale-num ${idx === activeIndex ? 'active' : ''}`}
                                onClick={() => handleScaleClick(idx)}
                                title={name}
                            >
                                {name}
                            </span>
                        ))}
                    </div>

                    {/* Slider Track */}
                    <div className="se-slider-track" ref={sliderTrackRef}>
                        {/* Track Line */}
                        <div className="se-track-line">
                            {/* Tick marks */}
                            {[...Array(totalStates * 5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`se-tick ${i % 5 === 0 ? 'se-tick-major' : ''}`}
                                />
                            ))}
                        </div>

                        {/* Draggable Slider Dial */}
                        <div className="se-slider-dial" ref={sliderRef}>
                            <div className="se-dial-glow" />
                            <div className="se-dial-circle">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3L12 7H4L8 3Z" fill="currentColor" />
                                    <path d="M8 13L4 9H12L8 13Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>

                        {/* Glow effect on track */}
                        <div className="se-track-glow" />
                    </div>

                    {/* Current Value Display */}
                    <div className="se-current-value">
                        <span className="se-value-number">{activeIndex + 1}</span>
                        <span className="se-value-label">of {totalStates}</span>
                    </div>
                </div>

                {/* Mobile Dots Navigation */}
                <div className="se-mobile-dots">
                    {states.map((_, idx) => (
                        <button
                            key={idx}
                            className={`se-mobile-dot ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => handleScaleClick(idx)}
                            aria-label={`Go to ${states[idx].name}`}
                        />
                    ))}
                </div>

                {/* Mobile Counter */}
                <div className="se-mobile-counter">
                    <span className="current">{activeIndex + 1}</span> / {totalStates}
                </div>

                {/* Sparkle decoration */}
                <div className="se-sparkle">✦</div>

                {/* Swipe Indicator for Mobile */}
                <div className="se-swipe-indicator">
                    <span className="se-swipe-arrow left">← Swipe</span>
                    <span className="se-swipe-arrow right">Swipe →</span>
                </div>

                {/* Navigation Hint */}
                <div className="se-nav-hint">
                    <span>Use scroll or drag the lens</span>
                </div>
            </div>
        </section>
    );
};

export default StateExplorer;
