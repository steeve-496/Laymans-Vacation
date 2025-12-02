import React, { useRef } from "react";
import "./destinations.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

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
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const container = containerRef.current;
        const wrapper = document.querySelector(".cards-wrapper");
        const cards = gsap.utils.toArray(".destination-card");

        const entryTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        entryTl.from(cards, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });

        const getDraggableWidth = () => {
            return container.scrollWidth - wrapper.clientWidth;
        };

        Draggable.create(container, {
            type: "x",
            bounds: {
                minX: -getDraggableWidth(),
                maxX: 0
            },
            inertia: true,
            edgeResistance: 0.65,
            cursor: "grab",
            activeCursor: "grabbing",
        });

    }, { scope: sectionRef });

    const handlePrev = () => {
        const container = containerRef.current;
        const wrapper = document.querySelector(".cards-wrapper");
        const cardWidth = 340; // 300px width + 40px gap
        const currentX = gsap.getProperty(container, "x");
        const newX = Math.min(currentX + cardWidth, 0);

        gsap.to(container, {
            x: newX,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function () {
                Draggable.get(container).update();
            }
        });
    };

    const handleNext = () => {
        const container = containerRef.current;
        const wrapper = document.querySelector(".cards-wrapper");
        const cardWidth = 340;
        const currentX = gsap.getProperty(container, "x");
        const minX = -(container.scrollWidth - wrapper.clientWidth);
        const newX = Math.max(currentX - cardWidth, minX);

        gsap.to(container, {
            x: newX,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function () {
                Draggable.get(container).update();
            }
        });
    };

    return (
        <section className="destinations-section" ref={sectionRef}>
            <h2 className="destinations-title">Find Your Destiny</h2>

            <div className="cards-wrapper">
                <button className="nav-btn prev-btn" onClick={handlePrev}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button className="nav-btn next-btn" onClick={handleNext}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>

                <div className="cards-container" ref={containerRef}>
                    {destinations.map((dest, index) => (
                        <div
                            className="destination-card"
                            key={index}
                            onClick={() => onCountrySelect && onCountrySelect(dest.name)}
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
