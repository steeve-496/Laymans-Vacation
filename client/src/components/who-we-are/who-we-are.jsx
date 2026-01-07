import React, { useRef } from 'react';
import './who-we-are.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhoWeAre() {
    const containerRef = useRef(null);
    const logoRef = useRef(null);

    useGSAP(() => {
        // Continuous 3D rotation for the logo icon
        gsap.to(logoRef.current, {
            rotationY: 360,
            duration: 12,
            repeat: -1,
            ease: "none"
        });

        // Floating effect
        gsap.to(logoRef.current, {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        const titles = containerRef.current.querySelectorAll('.wwa-title');
        const content = containerRef.current.querySelectorAll('.wwa-content p');
        const btn = containerRef.current.querySelector('.wwa-btn');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 80%",
                scrub: 1, // Smooth scrub
            }
        });

        // Staggered reveal for Title and Content
        tl.fromTo(titles,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.2, ease: "power2.out" }
        )
            .fromTo(content,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
                "<0.2"
            )
            .fromTo(btn,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, ease: "back.out(1.7)" },
                "<0.3"
            );

        // Subtle parallax/slide for the logo side
        gsap.fromTo(".wwa-visual-side",
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1.5
                }
            }
        );

    }, { scope: containerRef });

    return (
        <section className="wwa-section" id="who-we-are" ref={containerRef}>
            <div className="wwa-layout-wrapper">

                {/* Text Side: Brand Story */}
                <div className="wwa-text-side">
                    <div className="wwa-header-content">
                        <span className="wwa-badge">Our Legacy</span>
                        <div className="wwa-title-container">
                            <h2 className="wwa-title">BEHIND THE</h2>
                            <h2 className="wwa-title">JOURNEY</h2>
                        </div>
                    </div>

                    <div className="wwa-content">
                        <p>
                            At <span className="wwa-highlight-text">Layman's Vacation</span>, we believe that travel should be more than just visiting a destination; it should be about connecting with the soul of a place.
                        </p>
                        <p>
                            From the misty hills of Kerala to the vibrant streets of Azerbaijan, we curate experiences that are authentic, immersive, and tailored just for you. Our mission is to make the world accessible to everyone, one unforgettable story at a time.
                        </p>

                        <div className="wwa-actions">
                            <button className="wwa-btn">
                                <span>LEARN OUR STORY</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visual Side: 3D Logo */}
                <div className="wwa-visual-side">
                    <div className="wwa-3d-scene">
                        <div className="wwa-logo-wrapper" ref={logoRef}>
                            <img
                                src="https://ik.imagekit.io/tsxbvz4jb6/Laymans/logo-m.png"
                                alt="Layman Logo Icon"
                                className="wwa-3d-logo"
                            />
                            {/* Subtle shadow beneath */}
                            <div className="wwa-logo-shadow"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
