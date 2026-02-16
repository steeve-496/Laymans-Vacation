import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import ConfirmModal from './ConfirmModal';

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({
        src: '',
        alt: '',
        caption: '',
        className: ''
    });
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/gallery');
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch gallery", error);
        }
    };

    const handleDelete = async (id) => {
        setModal({
            isOpen: true,
            title: 'Delete Image?',
            message: 'Are you sure you want to delete this image?',
            confirmText: 'Delete',
            isDestructive: true,
            onConfirm: async () => {
                await api.delete(`/gallery/${id}`);
                fetchItems();
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/gallery', newItem);
            setIsAdding(false);
            setNewItem({ src: '', alt: '', caption: '', className: '' });
            fetchItems();
        } catch (error) {
            alert("Failed to add image");
        }
    };

    // Simple Reordering logic (move up/down)
    const moveItem = async (index, direction) => {
        const newItems = [...items];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setItems(newItems);

        // Save order
        try {
            const orderedIds = newItems.map(item => item.id);
            await api.patch('/gallery/reorder', { orderedIds });
        } catch (e) {
            console.error("Failed to save order");
        }
    };


    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage Gallery</h2>
                {!isAdding && (
                    <button className="add-btn" onClick={() => setIsAdding(true)}>+ Add Image</button>
                )}
            </div>

            {isAdding && (
                <div className="item-list" style={{ marginBottom: 20 }}>
                    <h3>Add New Image</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                value={newItem.src}
                                onChange={e => setNewItem({ ...newItem, src: e.target.value })}
                                required
                                placeholder="https://..."
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Caption</label>
                                <input
                                    value={newItem.caption}
                                    onChange={e => setNewItem({ ...newItem, caption: e.target.value })}
                                />
                            </div>
                            <div className="form-group half">
                                <label>Alt Text</label>
                                <input
                                    value={newItem.alt}
                                    onChange={e => setNewItem({ ...newItem, alt: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Layout Size</label>
                            <select
                                value={newItem.className}
                                onChange={e => setNewItem({ ...newItem, className: e.target.value })}
                            >
                                <option value="">Standard (Square-ish)</option>
                                <option value="wide">Wide</option>
                                <option value="tall">Tall</option>
                                <option value="large">Large (Big Square)</option>
                            </select>
                        </div>
                        <button type="submit" className="add-btn">Add to Gallery</button>
                        <button type="button" className="delete-btn" style={{ marginLeft: 10 }} onClick={() => setIsAdding(false)}>Cancel</button>
                    </form>
                </div>
            )}

            <div className="item-list">
                {items.length === 0 ? <p>No images in gallery.</p> : null}
                {items.map((item, index) => (
                    <div key={item.id} className="list-item">
                        <div className="item-info">
                            <img src={item.src} alt={item.alt} className="item-thumb" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                            <div>
                                <strong>{item.caption || "No Caption"}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Size: {item.className || "Standard"}</div>
                            </div>
                        </div>
                        <div className="item-actions">
                            <div style={{ marginRight: 10 }}>
                                <button type="button" disabled={index === 0} onClick={() => moveItem(index, 'up')}>↑</button>
                                <button type="button" disabled={index === items.length - 1} onClick={() => moveItem(index, 'down')}>↓</button>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>


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

export default GalleryManager;
