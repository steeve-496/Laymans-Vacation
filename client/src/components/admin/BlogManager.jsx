import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmModal from './ConfirmModal';

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        author: '',
        authorImg: '',
        date: ''
    });
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        }
    };

    const handleDelete = async (id) => {
        setModal({
            isOpen: true,
            title: 'Delete Blog Post?',
            message: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmText: 'Delete',
            isDestructive: true,
            onConfirm: async () => {
                await api.delete(`/blogs/${id}`);
                fetchBlogs();
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentBlog.id) {
                await api.put(`/blogs/${currentBlog.id}`, currentBlog);
            } else {
                await api.post('/blogs', currentBlog);
            }
            setIsEditing(false);
            setCurrentBlog({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                category: '',
                author: '',
                authorImg: '',
                date: ''
            });
            fetchBlogs();
        } catch (error) {
            console.error(error);
            alert("Failed to save blog post");
        }
    };

    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setIsEditing(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentBlog({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            category: '',
            author: '',
            authorImg: '',
            date: ''
        });
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage Blog Posts</h2>
                {!isEditing && (
                    <button className="add-btn" onClick={() => { setCurrentBlog({}); setIsEditing(true); }}>
                        + Write New Post
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="item-list">
                    <h3>{currentBlog.id ? 'Edit Post' : 'New Post'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                value={currentBlog.title || ''}
                                onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Image URL</label>
                                <input
                                    value={currentBlog.image || ''}
                                    onChange={e => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                                    required
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group half">
                                <label>Category</label>
                                <input
                                    value={currentBlog.category || ''}
                                    onChange={e => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Date (e.g. Feb 10, 2026)</label>
                                <input
                                    value={currentBlog.date || ''}
                                    onChange={e => setCurrentBlog({ ...currentBlog, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group half">
                                <label>Author Name</label>
                                <input
                                    value={currentBlog.author || ''}
                                    onChange={e => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Author Image URL</label>
                            <input
                                value={currentBlog.authorImg || ''}
                                onChange={e => setCurrentBlog({ ...currentBlog, authorImg: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Excerpt (Short summary)</label>
                            <textarea
                                value={currentBlog.excerpt || ''}
                                onChange={e => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Content (HTML supported)</label>
                            <textarea
                                value={currentBlog.content || ''}
                                onChange={e => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                                rows="15"
                                required
                                style={{ fontFamily: 'monospace' }}
                            />
                            <small>Use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt; tags for formatting.</small>
                        </div>

                        <div className="form-actions" style={{ marginTop: 20 }}>
                            <button type="submit" className="add-btn">Save Post</button>
                            <button type="button" className="delete-btn" style={{ marginLeft: 10 }} onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="item-list">
                    {blogs.length === 0 ? <p>No blog posts found.</p> : null}
                    {blogs.map(blog => (
                        <div key={blog.id} className="list-item">
                            <div className="item-info">
                                <img src={blog.image} alt={blog.title} className="item-thumb" style={{ width: 60, height: 40, objectFit: 'cover' }} />
                                <div>
                                    <strong>{blog.title}</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{blog.date} | {blog.category}</div>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button className="edit-btn" onClick={() => handleEdit(blog)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                isDestructive={modal.isDestructive}
            />
        </div>
    );
};

export default BlogManager;
