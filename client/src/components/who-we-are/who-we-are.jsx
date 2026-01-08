import React, { useRef } from 'react';
import './who-we-are.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

gsap.registerPlugin(ScrollTrigger);

export default function WhoWeAre() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 969px)",
            isMobile: "(max-width: 968px)"
        }, (context) => {
            const { isMobile } = context.conditions;

            const titles = containerRef.current.querySelectorAll('.wwa-title');
            const content = containerRef.current.querySelectorAll('.wwa-content p');
            const btn = containerRef.current.querySelector('.wwa-btn');

            // --- TEXT ANIMATION ---
            gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: isMobile ? "top 80%" : "top 55%",
                }
            })
                .fromTo(titles,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
                )
                .fromTo(content,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
                    "-=0.6"
                )
                .fromTo(btn,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
                    "-=0.4"
                );

            // --- COLLAGE REVEAL ---
            gsap.fromTo(".wwa-collage-item",
                { opacity: 0, scale: 0.9, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".wwa-visual-side",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // --- COLLAGE PARALLAX (Subtle on Mobile) ---
            const parallaxTrigger = {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            };

            gsap.to(".wwa-img-1", {
                yPercent: isMobile ? -5 : -15,
                scrollTrigger: parallaxTrigger
            });

            gsap.to(".wwa-img-2", {
                yPercent: isMobile ? -15 : -40,
                scrollTrigger: parallaxTrigger
            });

            gsap.to(".wwa-img-3", {
                yPercent: isMobile ? -25 : -70,
                scrollTrigger: parallaxTrigger
            });
        });

        // Continuous floating animation
        gsap.to('.wwa-collage-deco', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);

        return () => clearTimeout(refreshTimer);

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

                {/* Visual Side: Parallax Collage */}
                <div className="wwa-visual-side">
                    <div className="wwa-collage-wrapper">

                        <div className="wwa-collage-item wwa-img-1">
                            <img
                                src={getOptimizedUrl("https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800", 800)}
                                alt="Travel Moments 1"
                            />
                            <div className="wwa-img-label">Global Discovery</div>
                        </div>

                        <div className="wwa-collage-item wwa-img-2">
                            <img
                                src={getOptimizedUrl("https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600", 600)}
                                alt="Travel Moments 2"
                            />
                        </div>

                        <div className="wwa-collage-item wwa-img-3">
                            <img
                                src={getOptimizedUrl("https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500", 500)}
                                alt="Travel Moments 3"
                            />
                        </div>

                        {/* Aesthetic decorative element */}
                        <div className="wwa-collage-deco"></div>

                    </div>
                </div>

            </div>
        </section>
    );
}
