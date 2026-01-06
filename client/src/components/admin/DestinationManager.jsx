import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PackageManager from './PackageManager';
import StateExplorerManager from './StateExplorerManager';

// Sortable Item Component
const SortableItem = ({ id, destination, onDelete, onEdit, onToggleVisibility }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="list-item">
            <div className="item-info">
                <span {...attributes} {...listeners} className="drag-handle">☰</span>
                <img src={destination.image} alt={destination.name} className="item-thumb" style={{ opacity: destination.isVisible ? 1 : 0.5 }} />
                <span>
                    {destination.name}
                    {!destination.isVisible && <span style={{ marginLeft: 8, fontSize: 10, background: '#cbd5e1', padding: '2px 6px', borderRadius: 4 }}>Hidden</span>}
                </span>
            </div>
            <div className="item-actions">
                <button
                    className="secondary-btn small"
                    onClick={() => onToggleVisibility(id)}
                    title={destination.isVisible ? "Hide from website" : "Show on website"}
                    style={{ marginRight: 5, padding: '5px 10px', fontSize: '16px', background: 'transparent', border: '1px solid #e2e8f0' }}
                >
                    {destination.isVisible ? '👁️' : '🚫'}
                </button>
                <button className="edit-btn" onClick={() => onEdit(destination)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
            </div>
        </div>
    );
};

const DestinationManager = () => {
    const [destinations, setDestinations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDest, setCurrentDest] = useState({ name: '', image: '', description: '', badge: '', isInternational: true, lat: 0, lng: 0 });
    const [activeTab, setActiveTab] = useState('overview'); // overview, packages, explorer

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations/admin/all');
            setDestinations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await api.patch(`/destinations/${id}/toggle-visibility`);
            fetchDestinations();
        } catch (error) {
            console.error("Failed to toggle visibility");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setDestinations((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Saving Order
                const orderedIds = newItems.map(i => i.id);
                api.patch('/destinations/reorder', { orderedIds });

                return newItems;
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this destination?')) {
            await api.delete(`/destinations/${id}`);
            fetchDestinations();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload with correct types
            const payload = {
                ...currentDest,
                lat: Number(currentDest.lat) || 0,
                lng: Number(currentDest.lng) || 0,
                isInternational: Boolean(currentDest.isInternational),
                badge: currentDest.badge || '' // Ensure string
            };

            let savedDest;
            if (currentDest.id) {
                const res = await api.put(`/destinations/${currentDest.id}`, payload);
                savedDest = res.data;
            } else {
                const res = await api.post('/destinations', payload);
                savedDest = res.data;
            }

            // If it was a new creation, we might want to stay in edit mode to add packages, 
            // but for simplicity currently we close. 
            // Better UX: Update currentDest with ID and switch to editing?
            // For now, let's just close to be safe or update state if user wants to add packages immediately.
            setCurrentDest(savedDest);
            alert("Destination Saved!");
            fetchDestinations();
        } catch (error) {
            console.error(error);
            alert("Failed to save: " + (error.response?.data?.message || error.message));
        }
    };

    const openEdit = (dest) => {
        setCurrentDest(dest);
        setActiveTab('overview');
        setIsEditing(true);
    };

    const openCreate = () => {
        setCurrentDest({ name: '', image: '', description: '', badge: '', isInternational: true, lat: 0, lng: 0 });
        setActiveTab('overview');
        setIsEditing(true);
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage Destinations</h2>
                <button className="add-btn" onClick={openCreate}>+ Add New</button>
            </div>

            {isEditing ? (
                <div className="admin-edit-container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3>{currentDest.id ? `Edit ${currentDest.name}` : 'New Destination'}</h3>
                        <button className="secondary-btn" onClick={() => setIsEditing(false)}>Back to List</button>
                    </div>

                    {/* Tabs */}
                    <div className="admin-tabs" style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                background: 'none',
                                borderBottom: activeTab === 'overview' ? '2px solid #2563eb' : 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: activeTab === 'overview' ? '#2563eb' : '#64748b'
                            }}
                        >
                            Overview
                        </button>
                        {currentDest.id && (
                            <>
                                <button
                                    className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('packages')}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        background: 'none',
                                        borderBottom: activeTab === 'packages' ? '2px solid #2563eb' : 'none',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        color: activeTab === 'packages' ? '#2563eb' : '#64748b'
                                    }}
                                >
                                    Packages
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('explorer')}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        background: 'none',
                                        borderBottom: activeTab === 'explorer' ? '2px solid #2563eb' : 'none',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        color: activeTab === 'explorer' ? '#2563eb' : '#64748b'
                                    }}
                                >
                                    State Explorer
                                </button>
                            </>
                        )}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="item-list">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input value={currentDest.name} onChange={e => setCurrentDest({ ...currentDest, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input value={currentDest.image} onChange={e => setCurrentDest({ ...currentDest, image: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea value={currentDest.description} onChange={e => setCurrentDest({ ...currentDest, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Badge (e.g., Best Seller)</label>
                                    <input value={currentDest.badge || ''} onChange={e => setCurrentDest({ ...currentDest, badge: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <label>International?</label>
                                    <input
                                        type="checkbox"
                                        checked={currentDest.isInternational}
                                        onChange={e => setCurrentDest({ ...currentDest, isInternational: e.target.checked })}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                                    <div>
                                        <label>Latitude</label>
                                        <input type="number" step="any" value={currentDest.lat || 0} onChange={e => setCurrentDest({ ...currentDest, lat: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label>Longitude</label>
                                        <input type="number" step="any" value={currentDest.lng || 0} onChange={e => setCurrentDest({ ...currentDest, lng: parseFloat(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: 20 }}>
                                    <button type="submit" className="add-btn">Save Changes</button>
                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={() => handleDelete(currentDest.id)}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        Delete Destination
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'packages' && currentDest.id && (
                        <div className="nested-manager">
                            <PackageManager destinationId={currentDest.id} />
                        </div>
                    )}

                    {activeTab === 'explorer' && currentDest.id && (
                        <div className="nested-manager">
                            <StateExplorerManager destinationId={currentDest.id} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="item-list">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={destinations.map(d => d.id)} strategy={verticalListSortingStrategy}>
                            {destinations.map((dest) => (
                                <SortableItem
                                    key={dest.id}
                                    id={dest.id}
                                    destination={dest}
                                    onDelete={handleDelete}
                                    onEdit={openEdit}
                                    onToggleVisibility={handleToggleVisibility}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

export default DestinationManager;
