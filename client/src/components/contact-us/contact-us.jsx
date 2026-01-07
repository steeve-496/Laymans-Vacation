import React, { useRef, useState } from 'react';
import './contact-us.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

export default function ContactUs() {
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        adults: '2',
        children: '0',
        journey_date: '',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle | sending | success | error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // --- EMAILJS CONFIG (Update these with your keys) ---
        const SERVICE_ID = "service_e7cstof";
        const TEMPLATE_ID = "template_poz3jxy";
        const PUBLIC_KEY = "MHh8RrL3_3HXGdNR-";

        if (SERVICE_ID === "YOUR_SERVICE_ID") {
            console.warn("EmailJS not configured yet. Set your keys in contact-us.jsx.");
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
            return;
        }

        setStatus('sending');

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                setStatus('success');
                setFormData({
                    user_name: '',
                    user_email: '',
                    user_phone: '',
                    adults: '2',
                    children: '0',
                    journey_date: '',
                    message: ''
                });
                setTimeout(() => setStatus('idle'), 5000);
            }, (error) => {
                console.error('EmailJS Error:', error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "center center",
                scrub: 1,
            }
        });

        tl.fromTo('.cu-container',
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        )
            .fromTo(['.cu-title', '.cu-text', '.cu-detail-item'],
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.5"
            )
            .fromTo(['.cu-form-group', '.cu-submit-btn'],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.8"
            );

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
                    {status === 'success' ? (
                        <div className="cu-status-overlay success">
                            <div className="cu-status-icon">✓</div>
                            <h3>Message Sent!</h3>
                            <p>We've received your inquiry and will reach out shortly.</p>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit}>
                            <div className="cu-form-group">
                                <label className="cu-form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    className="cu-form-input"
                                    placeholder="Your Name"
                                    required
                                    value={formData.user_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="cu-form-row">
                                <div className="cu-form-group half">
                                    <label className="cu-form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        className="cu-form-input"
                                        placeholder="name@gmail.com"
                                        required
                                        value={formData.user_email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="cu-form-group half">
                                    <label className="cu-form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="user_phone"
                                        className="cu-form-input"
                                        placeholder="+91 9876543210"
                                        value={formData.user_phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="cu-form-row">
                                <div className="cu-form-group third">
                                    <label className="cu-form-label">Adults</label>
                                    <input
                                        type="number"
                                        name="adults"
                                        min="1"
                                        className="cu-form-input"
                                        value={formData.adults}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="cu-form-group third">
                                    <label className="cu-form-label">Children</label>
                                    <input
                                        type="number"
                                        name="children"
                                        min="0"
                                        className="cu-form-input"
                                        value={formData.children}
                                        onChange={handleChange}
                                    />
                                    <span className="cu-helper-text">*Under 5 years free</span>
                                </div>
                                <div className="cu-form-group third">
                                    <label className="cu-form-label">Date of Journey</label>
                                    <input
                                        type="date"
                                        name="journey_date"
                                        className="cu-form-input"
                                        value={formData.journey_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="cu-form-group">
                                <label className="cu-form-label">Message</label>
                                <textarea
                                    name="message"
                                    className="cu-form-textarea"
                                    placeholder="Tell us about your dream destination..."
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className={`cu-submit-btn ${status === 'sending' ? 'sending' : ''}`}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sailing your message...' : 'Send Message'}
                            </button>
                            {status === 'error' && <p className="cu-error-text">Oops! Something went wrong. Please try again.</p>}
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
