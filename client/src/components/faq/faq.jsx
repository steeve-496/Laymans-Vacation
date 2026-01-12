import React, { useState, useRef } from 'react';
import './faq.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQ_DATA = [
    {
        question: "Do you offer customized travel packages?",
        answer: "Absolutely! We specialize in tailoring trips to your specific preferences, ensuring a unique and personal experience designed just for you."
    },
    {
        question: "What is your cancellation policy?",
        answer: "Our cancellation policy varies depending on the destination and booking timing. Generally, we offer flexible options up to 30 days before departure. Please refer to your specific booking terms for details."
    },
    {
        question: "Are flights included in the packages?",
        answer: "We offer both flight-inclusive and land-only packages. You can choose whichever suits your travel plans best. We can also assist with best-value flight bookings."
    },
    {
        question: "Do you provide travel insurance?",
        answer: "While we don't issue insurance directly, we strongly recommend and can guide you to our trusted partners to ensure you're fully covered for your journey."
    },
    {
        question: "What support do you offer during the trip?",
        answer: "You will have 24/7 on-ground support. Our local representatives and dedicated travel managers are always just a call away to assist with any needs."
    }
];

export default function FAQ() {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1px)", () => { // All screens
            gsap.fromTo(".faq-title",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );

            gsap.fromTo(".faq-item",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".faq-list",
                        start: "top 90%",
                        end: "bottom 80%",
                        scrub: 1,
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section className="faq-section" ref={containerRef}>
            <div className="faq-container">
                <div className="faq-header">
                    <span className="faq-subtitle">Common Queries</span>
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                </div>

                <div className="faq-list">
                    {FAQ_DATA.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div className="faq-question">
                                <h3>{item.question}</h3>
                                <span className="faq-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                            <div className="faq-answer">
                                <div className="faq-answer-inner">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
