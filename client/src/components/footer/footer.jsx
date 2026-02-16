import React, { useRef, useState, useEffect } from 'react';
import './footer.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fortawesome/fontawesome-free/css/all.min.css";


gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);
    const bgRef = useRef(null);
    const textRef = useRef(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const tripWords = ['Adventure?', 'Vacation?', 'Journey?', 'Escape?', 'Getaway?', 'Trip?'];

    useEffect(() => {
        const interval = setInterval(() => {
            gsap.to(textRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                    setCurrentWordIndex((prev) => (prev + 1) % tripWords.length);
                    gsap.fromTo(textRef.current,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        // Parallax Background Effect
        gsap.to(bgRef.current, {
            yPercent: 30, // Move image down slower than scroll
            ease: "none",
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom", // Start when footer top hits bottom of viewport
                end: "bottom top", // End when footer bottom hits top of viewport
                scrub: true
            }
        });

        // Content Reveal Animation
        gsap.fromTo(".footer-content-wrapper",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 80%",
                }
            }
        );

    }, { scope: footerRef });

    return (
        <footer className="footer-section" ref={footerRef}>
            {/* Parallax Background */}
            <div className="footer-bg-container">
                <img
                    ref={bgRef}
                    src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop"
                    alt="Scenic Background"
                    className="footer-bg-img"
                />
                <div className="footer-overlay"></div>
            </div>

            <div className="footer-content-wrapper">
                <div className="footer-container">
                    {/* CTA Header */}
                    <div className="footer-cta">
                        <h2>Ready for your next <span className="highlight-text-footer" ref={textRef}>{tripWords[currentWordIndex]}</span></h2>
                        <p>Explore the world with Layman's.</p>
                    </div>

                    <div className="footer-content">


                        <div className="footer-col">
                            <h3>Explore</h3>
                            <ul className="footer-links-list">
                                <li><a href="#destinations" className="footer-link">Destinations</a></li>
                                <li><a href="/gallery" className="footer-link">Gallery</a></li>
                                <li><a href="/blog" className="footer-link">Blog</a></li>
                                <li><a href="#testimonials" className="footer-link">Testimonials</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Contact</h3>
                            <ul className="footer-links-list">
                                <li><a href="#contact" className="footer-link">Get in Touch</a></li>
                                <li><a href="#" className="footer-link">Support</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Follow Us</h3>
                            <div className="footer-social-links">
                                <a href="https://www.linkedin.com/company/the-laymans-vacation" target="_blank" className="footer-social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                <a href="https://www.instagram.com/laymansvacation/" target="_blank" className="footer-social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                                <a href="https://www.facebook.com/p/The-LayMans-Vacation-100093117952320/" target="_blank" className="footer-social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-links">
                        <a href="#" className="footer-bottom-link">@{new Date().getFullYear()} Layman's</a>
                        <a href="#" className="footer-bottom-link">Privacy Policy</a>
                    </div>
                    <div className="footer-bottom-links">
                        <a href="#" className="footer-bottom-link">Back to Top ↑</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
