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
        tl.fromTo('.contact-container',
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );

        // 2. Info Panel Elements (Stagger)
        tl.fromTo(['.contact-title', '.contact-text', '.detail-item'],
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=0.5"
        );

        // 3. Form Elements (Stagger)
        tl.fromTo(['.form-group', '.submit-btn'],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=0.8"
        );

        // 4. Decor Floating Animation (Continuous)
        gsap.to('.contact-decor', {
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
        <section className="contact-section" ref={sectionRef} id="contact">
            <div className="contact-decorated-bg"></div>

            <div className="contact-container">
                <div className="contact-decor"></div>

                {/* Left Side: Info */}
                <div className="contact-info-panel">
                    <div className="contact-header">
                        <h2 className="contact-title">Start Your Journey</h2>
                        <p className="contact-text">
                            Ready to explore the world? Reach out to us for customized packages, travel tips, or just to say hello. We act as your personal travel concierge.
                        </p>
                    </div>

                    <div className="contact-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <span className="detail-text">Plarivattom, Coimbatore</span>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>
                            <span className="detail-text">+91 9876543210</span>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <span className="detail-text">explore@laymansvacation.com</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="contact-form-panel">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" placeholder="Your Name" />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="name@gmail.com" />
                            </div>
                            <div className="form-group half">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+91 9876543210" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group third">
                                <label className="form-label">Adults</label>
                                <input type="number" min="1" className="form-input" placeholder="2" />
                            </div>
                            <div className="form-group third">
                                <label className="form-label">Children</label>
                                <input type="number" min="0" className="form-input" placeholder="0" />
                                <span className="helper-text">*Under 5 years free</span>
                            </div>
                            <div className="form-group third">
                                <label className="form-label">Date of Journey</label>
                                <input type="date" className="form-input" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea className="form-textarea" placeholder="Tell us about your dream destination..."></textarea>
                        </div>
                        <button type="submit" className="contact-submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
