import React, { useRef, useState, useEffect } from "react";
import { optimizeCloudinaryUrl, optimizeUnsplashUrl } from "../../utils/imageOptimizer";
import "./testimonials.css";

// ----------------------------------------------------
// DATA STRUCTURE
// ----------------------------------------------------
const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        location: "Bali, Indonesia",
        rating: 5,
        review: "The most magical trip of my life. Bali was a dream, and the itinerary was perfect.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.pexels.com/photos/1802183/pexels-photo-1802183.jpeg"
    },
    {
        id: 2,
        name: "David Chen",
        location: "Kyoto, Japan",
        rating: 5,
        review: "I have never seen such attention to detail. Every hotel, every guide was perfect.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.pexels.com/photos/1673978/pexels-photo-1673978.jpeg"
    },
    {
        id: 3,
        name: "Emma Wilson",
        location: "Santorini, Greece",
        rating: 5,
        review: "Layman took care of everything. I just showed up and enjoyed the sunsets.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Michael Ross",
        location: "Cairo, Egypt",
        rating: 4,
        review: "An adventure I'll never forget. The desert safari was absolutely breathtaking.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg"
    }
];

const Testimonials = () => {
    // Duplicate for seamless loop
    const scrollerContent = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="marquee-section" id="testimonials">
            {/* Background Decoration: World Map */}
            <div className="marquee-bg-img">
                <img
                    src={optimizeUnsplashUrl("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop", 2000)}
                    alt="World Map Background"
                />
            </div>

            <div className="marquee-content-container">
                <div className="marquee-header">
                    <span className="marquee-badge">Client Stories</span>
                    <h2 className="marquee-title">Journeys of a Lifetime</h2>
                </div>

                <div className="marquee-track-container">
                    <div className="marquee-track">
                        {scrollerContent.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="marquee-card">
                                <div className="marquee-card-glass">
                                    <div className="marquee-quote-icon">“</div>

                                    <p className="marquee-review">{item.review}</p>

                                    <div className="marquee-divider"></div>

                                    <div className="marquee-profile">
                                        <img
                                            src={item.image.includes("cloudinary") ? optimizeCloudinaryUrl(item.image, 100) : optimizeUnsplashUrl(item.image, 100)}
                                            alt={item.name}
                                            className="marquee-avatar"
                                        />
                                        <div className="marquee-info">
                                            <h4 className="marquee-name">{item.name}</h4>
                                            <span className="marquee-location">{item.location}</span>
                                        </div>
                                    </div>

                                    {/* Subtle stamp watermark */}
                                    <div className="marquee-watermark">
                                        <img src={item.stamp.includes("cloudinary") ? optimizeCloudinaryUrl(item.stamp, 200) : optimizeUnsplashUrl(item.stamp, 200)} alt="" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;