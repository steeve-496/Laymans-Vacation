import React, { useRef, useEffect, useState } from "react";
import "./destinations.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";

const destinations = [
    { name: "Azerbaijan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655272/Azerbaijan_zx809y.png" },
    { name: "Bali", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Bali_nycaoz.jpg" },
    { name: "Bhutan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655259/Bhutan_bvh2xs.png" },
    { name: "Dubai", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Dubai_zpadzs.jpg" },
    { name: "Kerala", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Kerala_xewptj.png" },
    { name: "Kazakhstan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655271/Kazakhstan_zdwuir.png" },
    { name: "Malaysia", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655260/Malaysia_f61tdf.png" },
    { name: "Singapore", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655249/Singapore_gvfyn6.jpg" },
    { name: "Sri Lanka", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655257/Sri_Lanka_uux3sy.png" },
    { name: "Thailand", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png" },
    { name: "Vietnam", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655268/Vietnam_qgebdl.png" },
];

export default function Destinations({ onCountrySelect }) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const animationRef = useRef(null);

    // Duplicate destinations for seamless infinite scroll
    // 3 sets to be safe for larger screens and smooth looping
    const allDestinations = [...destinations, ...destinations, ...destinations];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollSpeed = 1;

        const animate = () => {
            if (!isDragging) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
                    // Reset to 0 when we've scrolled past the first set
                    // Actually, to be seamless, we should reset to a position that matches visually.
                    // If we have 3 sets, scrolling past 1/3 means we are at the start of the 2nd set.
                    // We can reset to 0 (start of 1st set) if they are identical.
                    // However, scrollWidth / 3 might not be exact due to padding/gap.
                    // A better approach for infinite scroll with native scrollLeft is tricky without exact pixel math.
                    // Let's try resetting when we reach the end of the second set to the end of the first set?
                    // Simplest: When scrollLeft >= (scrollWidth / 3) * 2, reset to scrollWidth / 3.
                    // This keeps us in the middle set.
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        // Better infinite loop logic:
        // We need to know the width of one set of items.
        // Let's assume the container is wide enough.
        // If we simply reset to 0 when we hit the end, it might jump.
        // Standard trick: Scroll to the end of the first set, then reset to 0?
        // No, we scroll. When we reach the point where the first item of the 2nd set is at the exact position of the first item of the 1st set...
        // That happens when scrollLeft == width of one set.

        // Let's refine the loop function inside the effect
        const loop = () => {
            if (!isDragging && scrollContainer) {
                scrollContainer.scrollLeft += scrollSpeed;

                // Check if we've scrolled past the first set
                // We can approximate the width of one set. 
                // Alternatively, check if we are near the end.
                // If we have 3 sets, total width W. One set is W/3.
                // When scrollLeft >= W/3, we can subtract W/3 to snap back to 0.
                // This assumes uniform width.
                const oneSetWidth = scrollContainer.scrollWidth / 3;
                if (scrollContainer.scrollLeft >= oneSetWidth) {
                    scrollContainer.scrollLeft -= oneSetWidth;
                }
            }
            animationRef.current = requestAnimationFrame(loop);
        }

        animationRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationRef.current);
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        cancelAnimationFrame(animationRef.current);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1; // Scroll-fast
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="destinations-section" id="destinations">
            <h2 className="destinations-title">Find Your Destiny</h2>

            <div
                className="cards-wrapper"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="cards-container">
                    {allDestinations.map((dest, index) => (
                        <div
                            className="destination-card"
                            key={index}
                            onClick={() => {
                                if (!isDragging) {
                                    onCountrySelect && onCountrySelect(dest.name)
                                }
                            }}
                        >
                            <div className="card-image-container">
                                <img
                                    src={optimizeCloudinaryUrl(dest.image, 400)}
                                    alt={dest.name}
                                    className="card-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="card-info">
                                <h3 className="country-name">{dest.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
