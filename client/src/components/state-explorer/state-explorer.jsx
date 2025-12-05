import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import "./state-explorer.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

import { optimizeCloudinaryUrl, optimizeUnsplashUrl } from "../../utils/imageOptimizer";

// ... imports

// Updated Data matching Destinations
const countryData = {
    "Azerbaijan": [
        { name: "Baku", description: "The City of Winds", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655272/Azerbaijan_zx809y.png" },
        { name: "Gabala", description: "Nature's Paradise", image: "https://images.unsplash.com/photo-1674585724516-7f41b5900e5a?q=80&w=1000&auto=format&fit=crop" },
        { name: "Sheki", description: "Ancient Silk Road", image: "https://images.unsplash.com/photo-1669286629955-4424e8633753?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Bali": [
        { name: "Ubud", description: "Cultural Heart", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Bali_nycaoz.jpg" },
        { name: "Kuta", description: "Sunset & Surf", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
        { name: "Nusa Penida", description: "Island Escape", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Bhutan": [
        { name: "Thimphu", description: "Capital City", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655259/Bhutan_bvh2xs.png" },
        { name: "Paro", description: "Tiger's Nest", image: "https://images.unsplash.com/photo-1578565678174-2c6b4f738069?q=80&w=1000&auto=format&fit=crop" },
        { name: "Punakha", description: "Winter Capital", image: "https://images.unsplash.com/photo-1620126442435-095562744955?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Dubai": [
        { name: "Burj Khalifa", description: "Touch the Sky", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Dubai_zpadzs.jpg" },
        { name: "Palm Jumeirah", description: "Island Wonder", image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?q=80&w=1000&auto=format&fit=crop" },
        { name: "Desert Safari", description: "Golden Dunes", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Kerala": [
        { name: "Alleppey", description: "Venice of the East", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Kerala_xewptj.png" },
        { name: "Munnar", description: "Tea Gardens", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop" },
        { name: "Wayanad", description: "Green Paradise", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Kazakhstan": [
        { name: "Almaty", description: "City of Apples", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655271/Kazakhstan_zdwuir.png" },
        { name: "Astana", description: "Modern Marvel", image: "https://images.unsplash.com/photo-1558588942-930faae5a389?q=80&w=1000&auto=format&fit=crop" },
        { name: "Charyn Canyon", description: "Valley of Castles", image: "https://images.unsplash.com/photo-1566315267438-76677f374750?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Malaysia": [
        { name: "Kuala Lumpur", description: "Twin Towers", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655260/Malaysia_f61tdf.png" },
        { name: "Langkawi", description: "Jewel of Kedah", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop" },
        { name: "Penang", description: "Pearl of Orient", image: "https://images.unsplash.com/photo-1590052955742-894d69352e29?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Singapore": [
        { name: "Marina Bay", description: "Iconic Skyline", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655249/Singapore_gvfyn6.jpg" },
        { name: "Sentosa", description: "State of Fun", image: "https://images.unsplash.com/photo-1542998966-267597554823?q=80&w=1000&auto=format&fit=crop" },
        { name: "Gardens by Bay", description: "Supertrees", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Sri Lanka": [
        { name: "Colombo", description: "Ocean City", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655257/Sri_Lanka_uux3sy.png" },
        { name: "Kandy", description: "Hill Capital", image: "https://images.unsplash.com/photo-1588242466440-272d1633d7b1?q=80&w=1000&auto=format&fit=crop" },
        { name: "Ella", description: "Mountain Views", image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Thailand": [
        { name: "Bangkok", description: "City of Angels", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png" },
        { name: "Phuket", description: "Pearl of Andaman", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1000&auto=format&fit=crop" },
        { name: "Chiang Mai", description: "Rose of North", image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Vietnam": [
        { name: "Hanoi", description: "City of Peace", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655268/Vietnam_qgebdl.png" },
        { name: "Ha Long Bay", description: "Descending Dragon", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop" },
        { name: "Da Nang", description: "Coastal Charm", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop" },
    ]
};

const StateExplorer = forwardRef(({ selectedCountry = "Azerbaijan", onCountryChange, onExplore }, ref) => {
    const [selectedStateIndex, setSelectedStateIndex] = useState(0);
    const dialRef = useRef(null);
    const containerRef = useRef(null);
    const countryListRef = useRef(null);

    useImperativeHandle(ref, () => containerRef.current);

    const states = countryData[selectedCountry];
    const currentState = states[selectedStateIndex];

    // 1. Entry Animation - Runs ONCE on mount
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 40%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(".state-display", {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(".dial-wrapper", {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "<"); // Use "<" to start this animation at the same time as the previous one
    }, { scope: containerRef });

    // 2. Interaction Logic - Runs when Country changes
    useGSAP(() => {
        const dial = dialRef.current;
        const countryList = countryListRef.current;
        const itemHeight = 50; // Height of each country item
        const snapValue = itemHeight;
        const DOT_SPACING = 35; // Increased spacing
        const START_ANGLE = 155;

        // Smooth transition for content update
        gsap.fromTo(".state-display .display-content",
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );

        // Animate Image (Zoom Out Effect)
        gsap.fromTo(".state-image",
            { scale: 1.2 },
            { scale: 1, duration: 0.8, ease: "power2.out" }
        );

        // Animate dots entering
        gsap.fromTo(".dial-dot",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.7)" }
        );

        // Scroll Country List to Selected Country
        const countryIndex = Object.keys(countryData).indexOf(selectedCountry);
        if (countryIndex !== -1) {
            gsap.to(countryList, {
                y: -countryIndex * itemHeight,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    // Update Draggable instance to reflect new position if needed
                    // Draggable.get(countryList)?.update();
                }
            });
        }

        // Helper to keep labels horizontal
        const updateLabelRotation = () => {
            const currentRotation = gsap.getProperty(dial, "rotation");
            gsap.set(".dot-label", { rotation: -currentRotation });
        };

        // Rotate Dial to Center Selected State
        // Target angle is 180 degrees (left side of circle)
        // Current angle of selected dot is START_ANGLE + (index * DOT_SPACING)
        // We need to rotate the DIAL by (180 - currentDotAngle)
        const targetRotation = 180 - (START_ANGLE + (selectedStateIndex * DOT_SPACING));

        gsap.to(dial, {
            rotation: targetRotation,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function () {
                // Update draggable if it exists to sync with animation
                const draggable = Draggable.get(dial);
                if (draggable) draggable.update();
                updateLabelRotation();
            }
        });


        // Dial Draggable (Rotation)
        Draggable.create(dial, {
            type: "rotation",
            inertia: true,
            onDrag: updateLabelRotation,
            onThrowUpdate: updateLabelRotation,
            snap: function (endValue) {
                return Math.round(endValue / DOT_SPACING) * DOT_SPACING;
            },
            onDragEnd: function () {
                // Calculate which index is closest to 180 degrees
                const currentRotation = this.rotation;
                // 180 = START_ANGLE + (index * DOT_SPACING) + currentRotation
                // index = (180 - currentRotation - START_ANGLE) / DOT_SPACING
                let index = Math.round((180 - currentRotation - START_ANGLE) / DOT_SPACING);

                // Clamp index to valid range
                if (index < 0) index = 0;
                if (index >= states.length) index = states.length - 1;

                if (index !== selectedStateIndex) {
                    setSelectedStateIndex(index);
                }
            }
        });

        // Initialize label rotation
        updateLabelRotation();

        // Country List Draggable (Vertical)
        Draggable.create(countryList, {
            type: "y",
            bounds: {
                minY: -((Object.keys(countryData).length - 1) * itemHeight),
                maxY: 0
            },
            inertia: true,
            edgeResistance: 0.65,
            cursor: "grab",
            activeCursor: "grabbing",
            snap: function (endValue) {
                return Math.round(endValue / snapValue) * snapValue;
            },
            onDragEnd: function () {
                const index = Math.abs(Math.round(this.y / itemHeight));
                const countries = Object.keys(countryData);
                if (countries[index] && countries[index] !== selectedCountry) {
                    onCountryChange && onCountryChange(countries[index]);
                    setSelectedStateIndex(0);
                }
            }
        });

    }, { scope: containerRef, dependencies: [selectedCountry, selectedStateIndex] }); // Added selectedStateIndex dependency

    return (
        <section className="state-explorer-section" ref={containerRef}>
            <div className="explorer-container">
                {/* Area 1: State Display */}
                <div className="state-display">
                    <div className="display-content">
                        <img
                            src={
                                currentState.image.includes("cloudinary")
                                    ? optimizeCloudinaryUrl(currentState.image, 800)
                                    : optimizeUnsplashUrl(currentState.image, 800)
                            }
                            alt={currentState.name}
                            className="state-image"
                            loading="lazy"
                        />
                        <div className="state-info">
                            <h3>{currentState.name}</h3>
                            <p>{currentState.description}</p>
                            <button
                                className="explore-btn"
                                onClick={() => onExplore && onExplore(currentState.name)}
                            >
                                Click to Explore
                            </button>
                        </div>
                    </div>
                </div>

                {/* Area 2 & 3: Dial and Country Selector */}
                <div className="controls-container">
                    {/* Rotating Dial Wrapper */}
                    <div className="dial-wrapper">
                        <div className="dial" ref={dialRef}>
                            {states.map((state, index) => {
                                const angle = 155 + (index * 35); // Updated spacing
                                return (
                                    <div
                                        key={index}
                                        className={`dial-dot ${index === selectedStateIndex ? "active" : ""}`}
                                        style={{
                                            transform: `rotate(${angle}deg) translate(40vh) rotate(-${angle}deg)`
                                        }}
                                        onClick={() => setSelectedStateIndex(index)}
                                    >
                                        <span className="dot-label">{state.name}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Country Selector (Area 3) - Inside the Dial */}
                        <div className="country-selector">
                            <div className="selector-mask">
                                <div className="selector-content" ref={countryListRef}>
                                    {Object.keys(countryData).map((country) => (
                                        <div
                                            key={country}
                                            className={`country-item ${selectedCountry === country ? "active" : ""}`}
                                            onClick={() => {
                                                onCountryChange && onCountryChange(country);
                                                setSelectedStateIndex(0);
                                            }}
                                        >
                                            {country}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default StateExplorer;
