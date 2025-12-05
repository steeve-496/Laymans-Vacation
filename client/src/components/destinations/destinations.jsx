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
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        const loop = () => {
            if (!isDragging && scrollContainer) {
                scrollContainer.scrollLeft += scrollSpeed;
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
