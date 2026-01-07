import React, { useRef } from 'react';
import './why-us.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        id: 1,
        title: "Expert Local Guides",
        description: "Unlock the souls of cities with guides who treat you like family, not just tourists."
    },
    {
        id: 2,
        title: "Tailored Itineraries",
        description: "Your journey is hand-crafted to match your pace, your taste, and your dreams."
    },
    {
        id: 3,
        title: "Seamless Support",
        description: "From takeoff to landing, our 24/7 concierge ensures you never face a hurdle alone."
    },
    {
        id: 4,
        title: "Exclusive Access",
        description: "Walk through doors others find locked. Private viewings, hidden gems, and VIP treatment."
    },
    {
        id: 5,
        title: "Sustainable Travel",
        description: "Explore the world responsibly. We ensure your footprint leaves only positive marks."
    }
];

export default function WhyUs() {
    const containerRef = useRef(null);
    const leftColRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 968px)", () => {
            // Pin the left column image
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: leftColRef.current,
                scrub: true,
                // markers: true // Debug
            });

            // Subtle scale effect on the image as you scroll
            gsap.to(".wu-visual-img", {
                scale: 1.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });

            // Fade in cards as they enter viewport
            const cards = gsap.utils.toArray(".wu-card");
            cards.forEach(card => {
                gsap.from(card, {
                    opacity: 0.2,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 50%",
                        toggleActions: "play none none reverse",
                        scrub: true
                    }
                });
            });
        });

    }, { scope: containerRef });

    return (
        <section className="wu-section" ref={containerRef} id="why-us">
            <div className="wu-layout">
                {/* Left Column: Pinned Image */}
                <div className="wu-col-left" ref={leftColRef}>
                    <div className="wu-visual-container">
                        <img
                            src={getOptimizedUrl("https://images.pexels.com/photos/731217/pexels-photo-731217.jpeg", 1200)}
                            alt="Luxury Tropical Experience"
                            className="wu-visual-img"
                        />
                        <div className="wu-overlay-text">
                            <h2>The Layman<br />Difference</h2>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scrolling Content */}
                <div className="wu-col-right">
                    <div className="wu-content-wrapper">
                        <div className="wu-header-mobile">
                            <h2>Why Choose Us</h2>
                        </div>

                        <div className="wu-cards-list">
                            {features.map((feature, index) => (
                                <div key={feature.id} className="wu-card">
                                    <div className="wu-card-number">0{index + 1}</div>
                                    <div className="wu-card-content">
                                        <h3 className="wu-card-title">{feature.title}</h3>
                                        <p className="wu-card-desc">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Spacer to ensure last card scrolls fully */}
                        <div className="wu-spacer"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
