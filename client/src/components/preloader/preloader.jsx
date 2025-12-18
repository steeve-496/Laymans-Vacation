import React, { useEffect, useState } from 'react';
import './preloader.css';

const Preloader = ({ isLoading }) => {
    // We keep the component mounted but add a class to animate it out
    // If we simply unmount, the exit animation won't play.
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Wait for animation to finish before unmounting (Wave 2.5s, Zoom at 2.1s)
            // Reduced to 1.2s for better LCP
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // SCROLL LOCK: Hide scrollbar while preloader is active to prevent logo shift
    useEffect(() => {
        if (shouldRender) {
            document.body.style.overflowY = 'hidden';
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowY = 'hidden'; // Lock root element too
            document.documentElement.style.overflowX = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowY = 'auto';
            document.documentElement.style.overflowX = 'hidden';
        }
        return () => {
            document.body.style.overflowY = 'auto';
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowY = 'auto';
            document.documentElement.style.overflowX = 'hidden';
        };
    }, [shouldRender]);

    if (!shouldRender) return null;

    return (
        <div className={`preloader-container ${!isLoading ? 'loaded' : ''}`}>
            <div className="water-fill"></div>
            <div className="logo-placeholder">
                <img src="https://res.cloudinary.com/divwmzd8g/image/upload/v1765448034/logo-m_xz97ui.png" alt="logo" width="180" height="180" />
            </div>
        </div>
    );
};

export default Preloader;
