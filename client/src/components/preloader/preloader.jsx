import React, { useEffect, useState } from 'react';
import './preloader.css';

const Preloader = ({ isLoading }) => {
    // We keep the component mounted but add a class to animate it out
    // If we simply unmount, the exit animation won't play.
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Wait for animation to finish before unmounting (0.8s matches CSS)
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`preloader-container ${!isLoading ? 'loaded' : ''}`}>
            <div className="logo-placeholder">
                {/* Image will go here later */}
                {/* LOGO */}
            </div>
        </div>
    );
};

export default Preloader;
