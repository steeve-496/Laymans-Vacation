import React, { useRef, useState, useEffect } from 'react';
import './Blog.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import Header from '../header/header';
import Footer from '../footer/footer';
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import api from '../../utils/api'; // Import API utility

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]); // State for blog posts
    const [loading, setLoading] = useState(true);

    // Fetch Blogs from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/blogs');
                setPosts(res.data);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useGSAP(() => {
        if (loading) return; // Wait for data

        // Hero Animation
        gsap.fromTo(".blog-hero-content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Blog Cards Animation
        const cards = gsap.utils.toArray(".blog-card");
        if (cards.length > 0) {
            ScrollTrigger.refresh();
            gsap.fromTo(cards,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".blog-grid",
                        start: "top 85%",
                    }
                }
            );
        }

    }, { scope: containerRef, dependencies: [loading, posts] });

    return (
        <>
            <Header />
            <main className="blog-page" ref={containerRef}>
                <div className="blog-hero">
                    <div className="blog-hero-content">
                        <h1 className="blog-title">Travel Journal</h1>
                        <p className="blog-subtitle">
                            Immersive stories, expert guides, and inspiration for your next journey.
                            Curated by travelers, for travelers.
                        </p>
                    </div>
                </div>

                <div className="blog-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>Loading stories...</div>
                    ) : (
                        <div className="blog-grid">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="blog-card"
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                >
                                    <div className="blog-card-image">
                                        <img
                                            src={getOptimizedUrl(post.image, 600)}
                                            alt={post.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="blog-card-content">
                                        <div className="blog-meta">
                                            <span className="blog-date">{post.date}</span>
                                            <span className="blog-category">{post.category}</span>
                                        </div>
                                        <h2 className="blog-card-title">{post.title}</h2>
                                        <p className="blog-card-excerpt">{post.excerpt}</p>

                                        <div className="blog-card-footer">
                                            <img src={post.authorImg} alt={post.author} className="author-avatar" />
                                            <span className="author-name">{post.author}</span>
                                            <div className="read-more-link">
                                                Read <span className="arrow">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="load-more-container">
                        <button className="load-more-btn">Load More Stories</button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
