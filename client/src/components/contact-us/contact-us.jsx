import React, { useRef } from 'react';
import './contact-us.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactUs() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "center center",
                scrub: 1,
            }
        });

        // 1. Container Entry
        tl.fromTo('.cu-container',
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );

        // 2. Info Panel Elements (Stagger)
        tl.fromTo(['.cu-title', '.cu-text', '.cu-detail-item'],
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=0.5"
        );

        // 3. Form Elements (Stagger)
        tl.fromTo(['.cu-form-group', '.cu-submit-btn'],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=0.8"
        );

        // 4. Decor Floating Animation (Continuous)
        gsap.to('.cu-decor', {
            y: -20,
            x: 10,
            rotation: 5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: sectionRef });

    return (
        <section className="cu-section" ref={sectionRef} id="contact">
            <div className="cu-decorated-bg"></div>

            <div className="cu-container">
                <div className="cu-decor"></div>

                {/* Left Side: Info */}
                <div className="cu-info-panel">
                    <div className="cu-header">
                        <h2 className="cu-title">Start Your Journey</h2>
                        <p className="cu-text">
                            Ready to explore the world? Reach out to us for customized packages, travel tips, or just to say hello. We act as your personal travel concierge.
                        </p>
                    </div>

                    <div className="cu-details">
                        <div className="cu-detail-item">
                            <div className="cu-detail-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <span className="cu-detail-text">Plarivattom, Coimbatore</span>
                        </div>
                        <div className="cu-detail-item">
                            <div className="cu-detail-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <span className="cu-detail-text">+91 9876543210</span>
                        </div>
                        <div className="cu-detail-item">
                            <div className="cu-detail-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <span className="cu-detail-text">explore@laymansvacation.com</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="cu-form-panel">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="cu-form-group">
                            <label className="cu-form-label">Full Name</label>
                            <input type="text" className="cu-form-input" placeholder="Your Name" />
                        </div>
                        <div className="cu-form-group">
                            <label className="cu-form-label">Full Name</label>
                            <input type="text" className="cu-form-input" placeholder="Your Name" />
                        </div>

                        <div className="cu-form-row">
                            <div className="cu-form-group half">
                                <label className="cu-form-label">Email Address</label>
                                <input type="email" className="cu-form-input" placeholder="name@gmail.com" />
                            </div>
                            <div className="cu-form-group half">
                                <label className="cu-form-label">Phone Number</label>
                                <input type="tel" className="cu-form-input" placeholder="+91 9876543210" />
                            </div>
                        </div>

                        <div className="cu-form-row">
                            <div className="cu-form-group third">
                                <label className="cu-form-label">Adults</label>
                                <input type="number" min="1" className="cu-form-input" placeholder="2" />
                            </div>
                            <div className="cu-form-group third">
                                <label className="cu-form-label">Children</label>
                                <input type="number" min="0" className="cu-form-input" placeholder="0" />
                                <span className="cu-helper-text">*Under 5 years free</span>
                            </div>
                            <div className="cu-form-group third">
                                <label className="cu-form-label">Date of Journey</label>
                                <input type="date" className="cu-form-input" />
                            </div>
                        </div>
                        <div className="cu-form-group">
                            <label className="cu-form-label">Message</label>
                            <textarea className="cu-form-textarea" placeholder="Tell us about your dream destination..."></textarea>
                        </div>
                        <button type="submit" className="cu-submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
