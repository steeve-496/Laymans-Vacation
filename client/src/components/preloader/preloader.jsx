import React, { useEffect, useState } from 'react';
import './preloader.css';

const Preloader = ({ isLoading }) => {
    // Always render initially to allow exit animation to play
    const [shouldRender, setShouldRender] = useState(true);
    const [loadingText, setLoadingText] = useState('Discovering');

    // Initialize isMobile correctly to avoid incorrect timeout duration
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [showLogo, setShowLogo] = useState(true);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Text Cycling Logic
    useEffect(() => {
        if (!isMobile) return;

        const texts = ['Discovering', 'Planning', 'Almost Ready'];
        let textIndex = 0;

        const textInterval = setInterval(() => {
            textIndex = (textIndex + 1) % texts.length;
            setLoadingText(texts[textIndex]);
        }, 1500); // Rotate text every 1.5s

        return () => clearInterval(textInterval);
    }, [isMobile]);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, isMobile ? 4500 : 1200); // Extended mobile duration to 4.5s
            return () => clearTimeout(timer);
        }
    }, [isLoading, isMobile]);

    // SCROLL LOCK
    useEffect(() => {
        if (shouldRender) {
            document.body.style.overflowY = 'hidden';
            document.documentElement.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
        }
        return () => {
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
        };
    }, [shouldRender]);

    if (!shouldRender) return null;

    return (
        <div className={`preloader-container ${!isLoading ? 'preloader-loaded' : ''}`}>
            {/* Desktop: Water Fill Animation */}
            <div className="preloader-water-fill"></div>

            {/* Desktop: Logo (Hidden on Mobile) */}
            {!isMobile && (
                <div className="preloader-logo-placeholder">
                    <img src="https://ik.imagekit.io/tsxbvz4jb6/Laymans/logo-m.png" alt="logo" width="180" height="180" />
                </div>
            )}

            {/* Mobile: World Map Reveal */}
            <div className="mobile-preloader-content">
                {/* Destination Dots */}
                <div className="pre-destination-dots">
                    <span className="pre-dot dot-1"></span>
                    <span className="pre-dot dot-2"></span>
                    <span className="pre-dot dot-3"></span>
                    <span className="pre-dot dot-4"></span>
                    <span className="pre-dot dot-5"></span>
                </div>

                {/* Flight Path */}
                {/* Flight Path SVG with Nested Airplane */}
                <svg className="pre-flight-path" viewBox="0 0 300 200">
                    <path
                        className="pre-path-line"
                        d="M 30,150 Q 80,80 150,100 T 270,50"
                        fill="none"
                        stroke="rgba(212, 175, 55, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="8,8"
                    />
                    <path
                        className="pre-path-glow"
                        d="M 30,150 Q 80,80 150,100 T 270,50"
                        fill="none"
                        stroke="rgba(212, 175, 55, 0.8)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Plane Group - Animated via CSS Motion Path */}
                    <g className="pre-airplane-group">
                        <path
                            fill="currentColor"
                            d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                            transform="rotate(90, 12, 12) scale(1.5) translate(-12, -12)"
                        />
                    </g>
                </svg>
            </div>

            {/* Mobile: Loading Text & Progress */}
            <div className="mobile-loading-info pre-fade-in">
                <p className="pre-loading-text">{loadingText}...</p>
                <div className="pre-loading-progress">
                    <div className="pre-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
