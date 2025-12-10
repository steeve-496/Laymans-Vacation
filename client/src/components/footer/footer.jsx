import React, { useRef } from 'react';
import './footer.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    useGSAP(() => {
        const columns = footerRef.current.querySelectorAll('.footer-col');

        gsap.fromTo(columns,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
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
            {/* Visual Curve */}
            <div className="footer-curve"></div>

            <div className="footer-container">
                {/* Brand Column */}
                <div className="footer-col footer-brand">
                    <h2>Layman's Vacation</h2>
                    <p className="footer-description">
                        Crafting soulful journeys and authentic travel experiences. Discover the world with us, one story at a time.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h3>Explore</h3>
                    <ul className="footer-links-list">
                        <li><a href="#" className="footer-link">Destinations</a></li>
                        <li><a href="#" className="footer-link">Packages</a></li>
                        <li><a href="#" className="footer-link">About Us</a></li>
                        <li><a href="#" className="footer-link">Gallery</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h3>Contact</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Plarivattom, Coimbatore</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>+91 9876543210</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>explore@laymansvacation.com</span>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="footer-col">
                    <h3>Newsletter</h3>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <p className="footer-description">Subscribe for travel tips and exclusive packages.</p>
                        <input type="email" placeholder="Your Email Address" className="footer-input" />
                        <button type="submit" className="footer-btn">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Layman's Vacation. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <a href="#" className="footer-bottom-link">Privacy Policy</a>
                    <a href="#" className="footer-bottom-link">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
