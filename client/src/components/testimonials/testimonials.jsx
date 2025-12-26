import React, { useRef } from "react";
import { optimizeCloudinaryUrl, optimizeUnsplashUrl } from "../../utils/imageOptimizer";
import "./testimonials.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
// ----------------------------------------------------
// DATA STRUCTURE (Backend Ready)
// ----------------------------------------------------
const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        location: "Bali, Indonesia",
        rating: 5,
        review: "The most magical trip of my life. The detailed itinerary made everything so easy. Bali was a dream!",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        stamp: "https://res.cloudinary.com/divwmzd8g/image/upload/v1764655250/Bali_nycaoz.jpg" // Using existing assets as 'stamp'
    },
    {
        id: 2,
        name: "David Chen",
        location: "Kyoto, Japan",
        rating: 5,
        review: "I've never seen such attention to detail. Every hotel, every guide was perfect. Highly recommended!",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Emma Wilson",
        location: "Santorini, Greece",
        rating: 5,
        review: "Layman took care of everything. I just showed up and enjoyed the sunsets. Worth every penny.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Michael Ross",
        location: "Cairo, Egypt",
        rating: 4,
        review: "An adventure I'll never forget. The desert safari they organized was absolutely breathtaking.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        stamp: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=200&auto=format&fit=crop"
    }
];
const Testimonials = () => {
    const containerRef = useRef(null);
    useGSAP(() => {
        // Staggered Entry
        gsap.from(".testi-postcard", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
        // Hover Effect specific logic handled in CSS/JS interaction if needed, 
        // but simple CSS hover is smoother for this.
    }, { scope: containerRef });
    return (
        <section className="testi-section" ref={containerRef} id="testimonials">
            <div className="testi-header">
                <span className="testi-tag">Happy Travelers</span>
                <h2 className="testi-title">Stories from the Road</h2>
                <p className="testi-subtitle">Real experiences from our community of wanderers.</p>
            </div>
            <div className="testi-grid">
                {TESTIMONIALS.map((item, index) => (
                    <div key={item.id} className="testi-postcard-wrapper">
                        <div className="testi-postcard">
                            {/* Front Design: Image + Quote */}
                            <div className="testi-postcard-content">
                                <div className="testi-stamp-mark">
                                    <img
                                        src={item.stamp.includes("cloudinary") ? optimizeCloudinaryUrl(item.stamp, 200) : optimizeUnsplashUrl(item.stamp, 200)}
                                        alt="stamp"
                                        className="testi-stamp-img"
                                    />
                                </div>
                                <div className="testi-quote-icon">“</div>
                                <p className="testi-review-text">{item.review}</p>

                                <div className="testi-user-profile">
                                    <img
                                        src={item.image.includes("cloudinary") ? optimizeCloudinaryUrl(item.image, 100) : optimizeUnsplashUrl(item.image, 100)}
                                        alt={item.name}
                                        className="testi-user-avatar"
                                    />
                                    <div className="testi-user-info">
                                        <h4 className="testi-user-name">{item.name}</h4>
                                        <span className="testi-user-location">{item.location}</span>
                                        <div className="testi-stars">{"★".repeat(item.rating)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default Testimonials;