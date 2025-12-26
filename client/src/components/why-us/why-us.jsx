import React, { useRef } from 'react';
import './why-us.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: "Expert Local Guides",
        description: "Experience destinations like a local. Our guides are passionate experts who know every hidden gem and story of the land, ensuring an authentic and immersive journey."
    },
    {
        title: "Tailored Itineraries",
        description: "Your journey, your way. We craft personalized travel plans that match your interests, pace, and preferences, creating a unique adventure just for you."
    },
    {
        title: "Seamless Support",
        description: "Travel with peace of mind. From the moment you book until you return home, our 24/7 support team is here to handle every detail."
    },
    {
        title: "Sustainable Travel",
        description: "We care about the planet and the people we visit. Our trips are designed to be eco-friendly and culturally respectful, leaving a positive impact."
    },
    {
        title: "Exclusive Access",
        description: "Unlock doors that are closed to others. We provide access to private events, behind-the-scenes tours, and unique cultural experiences."
    }
];

export default function WhyUs() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const leftCol = containerRef.current.querySelector('.wu-visual');
        const rightHeader = containerRef.current.querySelector('.wu-header');
        const rightContent = containerRef.current.querySelector('.wu-details');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });

        tl.fromTo(leftCol, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
            .fromTo(rightHeader, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
            .fromTo(rightContent, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

    }, { scope: containerRef });

    return (
        <section className="wu-section" ref={containerRef} id="why-us">
            <div className="wu-grid">
                <div className="wu-visual">
                    <img src={getOptimizedUrl("https://ik.imagekit.io/tsxbvz4jb6/Laymans/why-choose-us.webp", 1000)} alt="Travel Destination" className="wu-visual-img" loading="lazy" />
                    <div className="wu-visual-overlays"></div>
                </div>

                <div className="wu-info">
                    <div className="wu-header">
                        <h2 className="wu-title">WHY CHOOSE <br />THE LAYMAN'S VACATION</h2>
                    </div>

                    <div className="wu-details">
                        <div className="wu-features-list">
                            {features.map((feature, index) => (
                                <div key={index} className="wu-feature-item">
                                    <h3 className="wu-feature-item-title">{feature.title}</h3>
                                    <p className="wu-feature-item-desc">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
