import React, { useRef } from 'react';
import './who-we-are.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhoWeAre() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const titles = containerRef.current.querySelectorAll('.who-we-are-title');
        const content = containerRef.current.querySelectorAll('.who-we-are-content p');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            }
        });

        // Staggered reveal for Title (slide up from mask)
        tl.to(titles, {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out"
        });

        // Fade in and slide up for content paragraphs
        tl.to(content, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.8");

    }, { scope: containerRef });

    return (
        <section className="who-we-are-section" id="who-we-are" ref={containerRef}>
            <div className="who-we-are-container">
                <div className="who-we-are-title-container">
                    <div className="title-line">
                        <h2 className="who-we-are-title">WHO</h2>
                    </div>
                    <div className="title-line">
                        <h2 className="who-we-are-title">WE ARE</h2>
                    </div>
                </div>

                <div className="who-we-are-content-wrapper">
                    <div className="who-we-are-content">
                        <p>
                            At <span className="highlight-text">Layman's Vacation</span>, we believe that travel should be more than just visiting a destination; it should be about connecting with the soul of a place. We are a team of passionate explorers dedicated to crafting journeys that go beyond the ordinary.
                        </p>
                        <p>
                            From the misty hills of Kerala to the vibrant streets of Azerbaijan, we curate experiences that are authentic, immersive, and tailored just for you. Our mission is to make the world accessible to everyone, one unforgettable story at a time.
                        </p>
                    </div>
                    <button className="who-we-are-btn">
                        LEARN MORE
                    </button>
                </div>
            </div>
        </section>
    );
}
