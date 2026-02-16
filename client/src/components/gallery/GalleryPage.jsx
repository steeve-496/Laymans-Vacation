import React, { useRef, useState, useEffect } from 'react';
import './Gallery.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import Header from '../header/header';
import Footer from '../footer/footer';
import api from '../../utils/api'; // Import API

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
    const containerRef = useRef(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/gallery');
                setGalleryItems(res.data);
            } catch (error) {
                console.error("Failed to fetch gallery", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    useGSAP(() => {
        if (loading || galleryItems.length === 0) return;

        // Header
        gsap.fromTo(".gallery-page-header",
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Grid Items
        ScrollTrigger.refresh();

        const items = gsap.utils.toArray(".gallery-item");
        items.forEach((item, index) => {
            gsap.fromTo(item,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef, dependencies: [loading, galleryItems] });

    return (
        <>
            <Header />
            <main className="gallery-page" ref={containerRef}>
                <div className="gallery-page-header">
                    <span className="gallery-page-tag">Visual Journey</span>
                    <h1 className="gallery-page-title">Captured Moments</h1>
                    <p className="gallery-page-desc">
                        A collection of unforgettable experiences from travelers who dared to explore.
                        Let these images inspire your next adventure.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading gallery...</div>
                ) : (
                    <div className="gallery-grid">
                        {galleryItems.map((item) => (
                            <div
                                key={item.id}
                                className={`gallery-item ${item.className || ''}`}
                            >
                                <img
                                    src={getOptimizedUrl(item.src, 800)}
                                    alt={item.alt}
                                    className="gallery-image"
                                    loading="lazy"
                                />
                                <div className="gallery-overlay">
                                    <span className="gallery-caption">
                                        {item.caption ? (item.caption.length > 50 ? item.caption.substring(0, 50) + "..." : item.caption) : ""}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
