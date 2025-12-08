import React, { useEffect, useState } from 'react';
import './preloader.css';

const Preloader = ({ isLoading }) => {
    // We keep the component mounted but add a class to animate it out
    // If we simply unmount, the exit animation won't play.
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Wait for animation to finish before unmounting (Wave 2.0s + Zoom)
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`preloader-container ${!isLoading ? 'loaded' : ''}`}>
            <div className="water-fill"></div>
            <div className="logo-placeholder">
                <img src="logo-m.png" alt="logo" />
            </div>
        </div>
    );
};

export default Preloader;
