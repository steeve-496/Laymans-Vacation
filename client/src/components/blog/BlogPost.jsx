import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer';
import './Blog.css';
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import api from '../../utils/api'; // Import API

export default function BlogPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPost = async () => {
            try {
                const res = await api.get(`/blogs/${id}`);
                setPost(res.data);
            } catch (error) {
                console.error("Failed to fetch blog post", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    useGSAP(() => {
        if (!post || loading) return;

        const tl = gsap.timeline();

        tl.fromTo(".blog-post-hero-img",
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
        )
            .fromTo(".blog-post-header-content",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.6"
            )
            .fromTo(".blog-post-body",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.4"
            );

    }, { scope: contentRef, dependencies: [post, loading] });

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Loading...</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Header />
                <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Post not found</h2>
                    <button onClick={() => navigate('/blog')} className="load-more-btn" style={{ marginTop: '20px' }}>
                        Back to Blog
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <article className="blog-post-page" ref={contentRef}>
                <div className="blog-post-hero">
                    <img
                        src={getOptimizedUrl(post.image, 1600)}
                        alt={post.title}
                        className="blog-post-hero-img"
                    />
                    <div className="blog-post-overlay"></div>
                    <div className="blog-post-header-content">
                        <div className="blog-post-meta-top">
                            <span className="blog-category">{post.category}</span>
                            <span className="blog-date">{post.date}</span>
                        </div>
                        <h1 className="blog-post-title">{post.title}</h1>
                        <div className="blog-post-author">
                            <img src={post.authorImg} alt={post.author} className="author-avatar-large" />
                            <div className="author-info">
                                <span className="author-name-large">{post.author}</span>
                                <span className="read-time">5 min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="blog-post-container">
                    <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>

                    <div className="blog-post-footer">
                        <button onClick={() => navigate('/blog')} className="back-btn">
                            ← Back to all stories
                        </button>
                    </div>
                </div>
            </article>
            <Footer />
        </>
    );
}
