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

    // Background Refs
    const bgContainerRef = useRef(null);
    const bg1Ref = useRef(null);
    const bg2Ref = useRef(null);
    const activeBgRef = useRef(1); // 1 or 2

    const isAnimating = useRef(false);

    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            setLoading(true);
            try {
                // 1. Fetch Destinations first (Cached)
                const destRes = await api.getCached('/destinations');
                const currentDest = destRes.data.find(d => d.name === selectedCountry);

                if (currentDest) {
                    // 2. Fetch State Explorer data filtered by destinationId (Cached)
                    const stateRes = await api.getCached('/state-explorer', {
                        params: { destinationId: currentDest.id }
                    });

                    const filteredStates = stateRes.data.sort((a, b) => a.order - b.order);

                    if (filteredStates.length > 0) {
                        setStates(filteredStates);

                        // Preload
                        filteredStates.slice(0, 3).forEach(state => {
                            const img = new Image();
                            img.src = getOptimizedUrl(state.image, 1920);
                            const imgCard = new Image();
                            imgCard.src = getOptimizedUrl(state.image, 1200);
                        });
                    } else {
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

    // Initial Background Setup when data loads
    useEffect(() => {
        if (!loading && states.length > 0 && bg1Ref.current && bg2Ref.current) {
            const firstImage = getOptimizedUrl(states[activeIndex].image, 1920);

            // Set initial state without animation
            bg1Ref.current.style.backgroundImage = `url(${firstImage})`;
            bg1Ref.current.style.opacity = 1;
            bg1Ref.current.style.zIndex = 2;

            bg2Ref.current.style.opacity = 0;
            bg2Ref.current.style.zIndex = 1;
            activeBgRef.current = 1;
        }
    }, [loading, states]); // Only run when loading finishes and states are populated

    // Preload adjacent images
    useEffect(() => {
        if (states.length > 0) {
            const nextIdx = (activeIndex + 1) % states.length;
            const prevIdx = (activeIndex - 1 + states.length) % states.length;

            [nextIdx, prevIdx].forEach(idx => {
                const img = new Image();
                img.src = getOptimizedUrl(states[idx].image, 1920);
                const imgCard = new Image();
                imgCard.src = getOptimizedUrl(states[idx].image, 1200);
            });
        }
    }, [activeIndex, states]);

    const totalStates = states.length;
    const currentState = states[activeIndex];

    const handleBack = () => {
        navigate("/?instant=true#destinations");
    };

    const handleExplore = () => {
        navigate(`/packages/${selectedCountry}/${currentState.name}`);
    };

    const changeState = useCallback((newIndex, direction = 1) => {
        if (newIndex < 0 || newIndex >= totalStates || newIndex === activeIndex || isAnimating.current) return;

        isAnimating.current = true;

        // Mobile Check
        const isMobile = window.innerWidth <= 992;
        const slideDirection = direction > 0 ? -1 : 1;

        // --- Background Transition Logic ---
        const nextState = states[newIndex];
        const nextImage = getOptimizedUrl(nextState.image, 1920);

        // Identify which BG is active and which is next
        const currentBg = activeBgRef.current === 1 ? bg1Ref.current : bg2Ref.current;
        const nextBg = activeBgRef.current === 1 ? bg2Ref.current : bg1Ref.current;

        // Set next image
        nextBg.style.backgroundImage = `url(${nextImage})`;
        nextBg.style.zIndex = 10; // Bring to front
        currentBg.style.zIndex = 5; // Send to back relative to next

        // -----------------------------------

        const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            onComplete: () => {
                isAnimating.current = false;
                activeBgRef.current = activeBgRef.current === 1 ? 2 : 1; // Swap active ref
                // Cleanup: Hide the old background completely after transition
                gsap.set(currentBg, { opacity: 0 });
            }
        });

        // Background Crossfade
        tl.fromTo(nextBg,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }
            , 0);

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
            }, 0);

            tl.call(() => {
                setActiveIndex(newIndex);
            }, null, 0.4);

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
                0.5
            );
        } else {
            // Desktop Transitions
            tl.to(cardRef.current, {
                opacity: 0,
                x: slideDirection * 60,
                scale: 0.96,
                duration: 0.5,
                ease: "circ.inOut"
            }, 0);

            tl.call(() => {
                setActiveIndex(newIndex);
            }, null, 0.4);

            tl.fromTo(cardRef.current,
                { opacity: 0, x: -slideDirection * 60, scale: 0.96 },
                { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "expo.out" },
                0.5
            );

            // Update slider position
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
    }, [activeIndex, totalStates, states]);

    // Handle wheel event
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let wheelTimeout = null;
        let accumulatedDelta = 0;
        const threshold = 30;
        let lastTriggerTime = 0;
        const cooldown = 400;

        const handleWheel = (e) => {
            e.preventDefault();
            const now = Date.now();
            accumulatedDelta += e.deltaY;

            if (wheelTimeout) clearTimeout(wheelTimeout);

            if (Math.abs(accumulatedDelta) > threshold && (now - lastTriggerTime) > cooldown) {
                const direction = accumulatedDelta > 0 ? 1 : -1;
                const newIndex = activeIndex + direction;

                if (newIndex >= 0 && newIndex < totalStates) {
                    changeState(newIndex, direction);
                    lastTriggerTime = now;
                }
                accumulatedDelta = 0;
            } else {
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

    // Touch swipe
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchMove = (e) => e.preventDefault();

        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    changeState(activeIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    changeState(activeIndex + (deltaY < 0 ? 1 : -1), deltaY < 0 ? 1 : -1);
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

    // Draggable
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
                    return Math.round(endValue / segmentHeight) * segmentHeight;
                }
            },
            onDrag: function () {
                gsap.set('.se-track-glow', { y: this.y });

                // Highlight scale number
                const progress = this.y / maxY;
                const stateIndex = Math.round(progress * (totalStates - 1));
                document.querySelectorAll('.se-scale-num').forEach((el, idx) => {
                    el.classList.toggle('active', idx === stateIndex);
                });
            },
            onDragEnd: function () {
                const progress = this.y / maxY;
                const newIndex = Math.round(progress * (totalStates - 1));
                if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalStates) {
                    changeState(newIndex, newIndex > activeIndex ? 1 : -1);
                } else {
                    // Snap back visual if no change
                    const newY = (activeIndex / Math.max(totalStates - 1, 1)) * maxY;
                    gsap.to(this.target, { y: newY, duration: 0.3 });
                }
            }
        })[0];

        return () => { if (draggable) draggable.kill(); };
    }, { scope: sectionRef, dependencies: [totalStates, activeIndex] });

    const handleScaleClick = (index) => {
        if (index === activeIndex) return;
        changeState(index, index > activeIndex ? 1 : -1);
    };

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
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.4"
        );
    }, { scope: sectionRef, dependencies: [loading, states.length] });

    const scaleLabels = states.map(state => state.name);

    if (loading) {
        return (
            <section className="se-section se-skeleton">
                <div className="se-bg-container" style={{ backgroundColor: '#111' }} />
                <div className="se-content">
                    <div className="se-card skeleton-card">
                        <div className="se-card-image skeleton-pulse" />
                    </div>
                </div>
            </section>
        );
    }

    if (states.length === 0) return <div>No content</div>;
    if (!currentState) return null;

    return (
        <section className="se-section" ref={sectionRef}>
            <div className="se-bg-container" ref={bgContainerRef}>
                <div className="se-bg-layer" ref={bg1Ref}></div>
                <div className="se-bg-layer" ref={bg2Ref}></div>
            </div>
            <div className="se-bg-overlay" />

            <div className="se-content">
                <div className="se-card" ref={cardRef}>
                    <button className="se-back-btn" onClick={handleBack}>
                        <span className="se-back-arrow">←</span><span>Back</span>
                    </button>
                    <div className="se-card-image">
                        <img src={getOptimizedUrl(currentState.image, 1200)} alt={currentState.name} loading="lazy" />
                        <div className="se-card-gradient" />
                    </div>
                    <div className="se-card-content">
                        <h1 className="se-card-title">{currentState.name.toUpperCase()}</h1>
                        <p className="se-card-description">{currentState.description}</p>
                        <button className="se-explore-btn" onClick={handleExplore}>Click to Explore</button>
                    </div>
                </div>

                <div className="se-lens-slider">
                    <div className="se-scale-numbers">
                        {scaleLabels.map((name, idx) => (
                            <span key={idx} className={`se-scale-num ${idx === activeIndex ? 'active' : ''}`} onClick={() => handleScaleClick(idx)} title={name}>{name}</span>
                        ))}
                    </div>
                    <div className="se-slider-track" ref={sliderTrackRef}>
                        <div className="se-track-line">
                            {[...Array(totalStates * 5)].map((_, i) => (
                                <div key={i} className={`se-tick ${i % 5 === 0 ? 'se-tick-major' : ''}`} />
                            ))}
                        </div>
                        <div className="se-slider-dial" ref={sliderRef}>
                            <div className="se-dial-glow" />
                            <div className="se-dial-circle">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3L12 7H4L8 3Z" fill="currentColor" /><path d="M8 13L4 9H12L8 13Z" fill="currentColor" /></svg>
                            </div>
                        </div>
                        <div className="se-track-glow" />
                    </div>
                    <div className="se-current-value">
                        <span className="se-value-number">{activeIndex + 1}</span>
                        <span className="se-value-label">of {totalStates}</span>
                    </div>
                </div>

                <div className="se-mobile-dots">
                    {states.map((_, idx) => (
                        <button key={idx} className={`se-mobile-dot ${idx === activeIndex ? 'active' : ''}`} onClick={() => handleScaleClick(idx)} aria-label={`Go to ${states[idx].name}`} />
                    ))}
                </div>

                <div className="se-mobile-counter"><span className="current">{activeIndex + 1}</span> / {totalStates}</div>
                <div className="se-sparkle">✦</div>
                <div className="se-swipe-indicator"><span className="se-swipe-arrow left">← Swipe</span><span className="se-swipe-arrow right">Swipe →</span></div>
                <div className="se-nav-hint"><span>Use scroll or drag the lens</span></div>
            </div>
        </section>
    );
};

export default StateExplorer;
