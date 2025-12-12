import React, { useRef, useEffect, useState } from "react";
import "./destinations.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const internationalDestinations = [
    { name: "Azerbaijan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655272/Azerbaijan_zx809y.png" },
    { name: "Bali", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Bali_nycaoz.jpg" },
    { name: "Bhutan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655259/Bhutan_bvh2xs.png" },
    { name: "Dubai", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Dubai_zpadzs.jpg" },
    { name: "Kazakhstan", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655271/Kazakhstan_zdwuir.png" },
    { name: "Malaysia", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655260/Malaysia_f61tdf.png" },
    { name: "Singapore", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655249/Singapore_gvfyn6.jpg" },
    { name: "Sri Lanka", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655257/Sri_Lanka_uux3sy.png" },
    { name: "Thailand", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Thailand_a2ide4.png" },
    { name: "Vietnam", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655268/Vietnam_qgebdl.png" },
];

const domesticDestinations = [
    { name: "Munnar", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446410/munnar_wdhd05.png" },
    { name: "Wayanad", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446721/wayanad_l8wmyr.png" },
    { name: "Varkala", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1765446410/varkala_c8nxll.png" },
    { name: "Alleppey", image: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655266/Kerala_xewptj.png" },
];

export default function Destinations({ onCountrySelect }) {
    const scrollRefIntl = useRef(null);
    const scrollRefDom = useRef(null);
    const sectionRef = useRef(null);

    // Independent dragging states
    const [draggingIntl, setDraggingIntl] = useState(false);
    const [draggingDom, setDraggingDom] = useState(false);

    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const animationRef = useRef(null);

    // Duplicate for infinite scroll
    const intlList = [...internationalDestinations, ...internationalDestinations, ...internationalDestinations];
    const domList = [...domesticDestinations, ...domesticDestinations, ...domesticDestinations, ...domesticDestinations];

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
                end: "top 20%",
                scrub: 1,
            }
        });

        tl.from(".stream-label", {
            x: -50,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        })
            .from(".destination-card", {
                y: 50,
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power2.out"
            }, "-=0.5");

    }, { scope: sectionRef });

    useEffect(() => {
        const containerIntl = scrollRefIntl.current;
        const containerDom = scrollRefDom.current;

        const scrollSpeed = 0.8;

        const loop = () => {
            // Stream 1: Left to Right (Standard) - International
            if (!draggingIntl && containerIntl) {
                containerIntl.scrollLeft += scrollSpeed;
                const oneSetWidth = containerIntl.scrollWidth / 3;
                if (containerIntl.scrollLeft >= oneSetWidth) {
                    containerIntl.scrollLeft -= oneSetWidth;
                }
            }

            // Stream 2: Right to Left (Opposite) - Domestic
            // To simulate right-to-left autoscroll, we actually scroll left, but we start from a high scroll position
            // OR simpler: we just scroll left-to-right but Render specific CSS to reverse order? 
            // EASIER: Just scroll them both left-to-right but visually user perceives 'Opposite' if we start at different ends?
            // BETTER: Standard Infinite Scroll is always increasing scrollLeft. To go other way, we decrease scrollLeft.

            if (!draggingDom && containerDom) {
                containerDom.scrollLeft -= scrollSpeed;
                // Loop logic for reverse scroll
                if (containerDom.scrollLeft <= 0) {
                    const oneSetWidth = containerDom.scrollWidth / 4; // 4 duplicates for domestic
                    containerDom.scrollLeft += oneSetWidth;
                }
            }

            animationRef.current = requestAnimationFrame(loop);
        }

        // Initialize Domestic scroll to middle so it can scroll backwards
        if (containerDom) {
            containerDom.scrollLeft = containerDom.scrollWidth / 2;
        }

        animationRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationRef.current);
    }, [draggingIntl, draggingDom]);

    // Generic Drag Handlers
    const handleMouseDown = (e, ref, setDragging) => {
        setDragging(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const handleMouseMove = (e, ref, isDragging) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        ref.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = (setDragging) => {
        setDragging(false);
    };

    const DragEvents = (ref, isDragging, setDragging) => ({
        onMouseDown: (e) => handleMouseDown(e, ref, setDragging),
        onMouseLeave: () => handleMouseUp(setDragging),
        onMouseUp: () => handleMouseUp(setDragging),
        onMouseMove: (e) => handleMouseMove(e, ref, isDragging)
    });

    return (
        <section className="destinations-section" id="destinations" ref={sectionRef}>
            <div className="stream-container international-stream">
                <div className="stream-header">
                    <h2 className="stream-label">International</h2>
                    <span className="stream-sub">Beyond Borders</span>
                </div>
                <div
                    className="cards-wrapper"
                    ref={scrollRefIntl}
                    {...DragEvents(scrollRefIntl, draggingIntl, setDraggingIntl)}
                >
                    <div className="cards-container">
                        {intlList.map((dest, index) => (
                            <DestinationCard key={`intl-${index}`} dest={dest} onSelect={onCountrySelect} isDragging={draggingIntl} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="stream-container domestic-stream">
                <div className="stream-header align-right">
                    <h2 className="stream-label">Domestic</h2>
                    <span className="stream-sub">God's Own Country</span>
                </div>
                <div
                    className="cards-wrapper"
                    ref={scrollRefDom}
                    {...DragEvents(scrollRefDom, draggingDom, setDraggingDom)}
                >
                    <div className="cards-container">
                        {domList.map((dest, index) => (
                            <DestinationCard key={`dom-${index}`} dest={dest} onSelect={onCountrySelect} isDragging={draggingDom} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const DestinationCard = ({ dest, onSelect, isDragging }) => (
    <div
        className="destination-card"
        onClick={() => {
            if (!isDragging) {
                onSelect && onSelect(dest.name)
            }
        }}
    >
        <div className="card-image-container">
            <img
                src={optimizeCloudinaryUrl(dest.image, 400)}
                alt={dest.name}
                className="card-image"
                loading="lazy"
                width="350"
                height="450"
            />
        </div>
        <div className="card-info">
            <h3 className="country-name">{dest.name}</h3>
        </div>
    </div>
);
