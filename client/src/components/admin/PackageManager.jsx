import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../utils/api';
import ConfirmModal from './ConfirmModal';

const SortableItem = ({ id, pkg, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="list-item mobile-compact-item">
            <div className="item-info">
                <span {...attributes} {...listeners} className="drag-handle">☰</span>
                <img src={pkg.image} alt={pkg.title} className="item-thumb" />
                <div>
                    <strong>{pkg.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{pkg.duration} | {pkg.price}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        {pkg.destination?.name ? pkg.destination.name : 'No Destination'} - {pkg.category}
                    </div>
                </div>
            </div>
            <div className="item-actions">
                <button className="edit-btn" onClick={() => onEdit(pkg)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
            </div>
        </div>
    );
};

const PackageManager = ({ destinationId }) => {
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Filter packages if destinationId is provided
    const filteredPackages = destinationId
        ? packages.filter(p => p.destinationId === destinationId)
        : packages;

    const [currentPkg, setCurrentPkg] = useState({
        title: '',
        image: '',
        price: '',
        duration: '',
        description: '',
        destinationId: '',
        category: '',
        details: { itinerary: [], itineraryDestinations: '' }
    });
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchPackages();
        fetchDestinations();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await api.get('/packages');
            setPackages(res.data);
        } catch (error) {
            console.error("Failed to fetch packages", error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            setDestinations(res.data);
        } catch (error) {
            console.error("Failed to fetch destinations", error);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setPackages((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const orderedIds = newItems.map(i => i.id);
                api.patch('/packages/reorder', { orderedIds });

                return newItems;
            });
        }
    };

    const handleDelete = async (id) => {
        setModal({
            isOpen: true,
            title: 'Delete Package?',
            message: 'Are you sure you want to delete this package?',
            confirmText: 'Delete',
            isDestructive: true,
            onConfirm: async () => {
                // Optimistic UI Update
                const previousPackages = [...packages];
                setPackages(prev => prev.filter(p => p.id !== id));

                try {
                    await api.delete(`/packages/${id}`);
                } catch (error) {
                    console.error("Failed to delete package", error);
                    // Revert
                    setPackages(previousPackages);
                    alert("Failed to delete. Please check your connection.");
                }
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...currentPkg,
                // Ensure details follows correct structure
                details: {
                    ...currentPkg.details,
                    itineraryDestinations: currentPkg.details?.itineraryDestinations || '',
                    itinerary: (currentPkg.details?.itinerary || []).map(day => ({
                        ...day,
                        // Ensure activities is an array if someone pasted a string or it's new
                        activities: Array.isArray(day.activities) ? day.activities : (day.activities ? [day.activities] : [])
                    }))
                }
            };

            if (currentPkg.id) {
                await api.put(`/packages/${currentPkg.id}`, payload);
            } else {
                await api.post('/packages', payload);
            }
            setIsEditing(false);
            resetForm();
            fetchPackages();
        } catch (error) {
            console.error("Failed to save package", error);
        }
    };

    const resetForm = () => {
        setCurrentPkg({
            title: '',
            image: '',
            price: '',
            duration: '',
            description: '',
            destinationId: destinationId || '',
            category: '',
            details: { itinerary: [], itineraryDestinations: '' }
        });
    };

    const handleEditClick = (pkg) => {
        // Ensure destinationId is handled correctly (sometimes API returns full object, sometimes ID)
        const destId = pkg.destinationId || (pkg.destination ? pkg.destination.id : '');

        // Deserialize details if needed (axios usually handles JSON automatically)
        const details = pkg.details || { itinerary: [] };

        setCurrentPkg({
            ...pkg,
            destinationId: destId,
            details: {
                ...details,
                itinerary: details.itinerary ? details.itinerary : [],
                itineraryDestinations: details.itineraryDestinations || ''
            }
        });
        setIsEditing(true);
    };

    // Itinerary Helper Functions
    const addItineraryDay = () => {
        const currentItinerary = currentPkg.details?.itinerary || [];
        const newDay = {
            day: currentItinerary.length + 1,
            title: '',
            title: '',
            activities: [], // Array of strings
            meals: '',     // e.g. "Breakfast, Lunch"
            stay: ''       // e.g. "Hotel in Pattaya"
        };
        setCurrentPkg({
            ...currentPkg,
            details: {
                ...currentPkg.details,
                itinerary: [...currentItinerary, newDay]
            }
        });
    };

    const updateItineraryDay = (index, field, value) => {
        const currentItinerary = [...(currentPkg.details?.itinerary || [])];
        currentItinerary[index] = {
            ...currentItinerary[index],
            [field]: value
        };
        setCurrentPkg({
            ...currentPkg,
            details: {
                ...currentPkg.details,
                itinerary: currentItinerary
            }
        });
    };

    const removeItineraryDay = (index) => {
        const currentItinerary = [...(currentPkg.details?.itinerary || [])];
        currentItinerary.splice(index, 1);
        // Re-index days
        const reIndexed = currentItinerary.map((day, idx) => ({ ...day, day: idx + 1 }));

        setCurrentPkg({
            ...currentPkg,
            details: {
                ...currentPkg.details,
                itinerary: reIndexed
            }
        });
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage Packages</h2>
                <button className="add-btn" onClick={() => { resetForm(); setIsEditing(true); }}>+ Add New</button>
            </div>

            {isEditing ? (
                <div className="item-list">
                    <h3>{currentPkg.id ? 'Edit Package' : 'Add Package'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'flex', gap: 20 }}>
                            {!destinationId && (
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Destination</label>
                                    <select
                                        className="admin-select"
                                        value={currentPkg.destinationId}
                                        onChange={e => setCurrentPkg({ ...currentPkg, destinationId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Destination</option>
                                        {destinations.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Category</label>
                                <select
                                    className="admin-select"
                                    value={currentPkg.category}
                                    onChange={e => setCurrentPkg({ ...currentPkg, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Honeymoon">Honeymoon (Romantic)</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Family">Family</option>
                                    <option value="Best Seller">Best Seller</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Title</label>
                            <input value={currentPkg.title} onChange={e => setCurrentPkg({ ...currentPkg, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input value={currentPkg.image} onChange={e => setCurrentPkg({ ...currentPkg, image: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Price</label>
                                <input value={currentPkg.price} onChange={e => setCurrentPkg({ ...currentPkg, price: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Duration</label>
                                <input value={currentPkg.duration} onChange={e => setCurrentPkg({ ...currentPkg, duration: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={currentPkg.description} onChange={e => setCurrentPkg({ ...currentPkg, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Itinerary Destinations Summary</label>
                            <input
                                placeholder="e.g. Pattaya (2 Nights) & Bangkok (2 Nights)"
                                value={currentPkg.details?.itineraryDestinations || ''}
                                onChange={e => setCurrentPkg({
                                    ...currentPkg,
                                    details: { ...currentPkg.details, itineraryDestinations: e.target.value }
                                })}
                            />
                        </div>

                        {/* Itinerary Editor */}
                        <div className="itinerary-editor section-block">
                            <h4>Itinerary</h4>
                            {(currentPkg.details?.itinerary || []).map((day, index) => (
                                <div key={index} className="itinerary-day-row">
                                    <div className="day-header">
                                        <span>Day {day.day}</span>
                                        <button type="button" className="delete-btn small" onClick={() => removeItineraryDay(index)}>Remove</button>
                                    </div>
                                    <input
                                        placeholder="Day Title (e.g. Arrival)"
                                        value={day.title}
                                        onChange={e => updateItineraryDay(index, 'title', e.target.value)}
                                        style={{ marginBottom: 5 }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 5 }}>
                                        <input
                                            placeholder="Meals (e.g. Breakfast, Lunch)"
                                            value={day.meals || ''}
                                            onChange={e => updateItineraryDay(index, 'meals', e.target.value)}
                                            style={{ fontSize: '0.85rem' }}
                                        />
                                        <input
                                            placeholder="Stay (e.g. Hotel in Pattaya)"
                                            value={day.stay || ''}
                                            onChange={e => updateItineraryDay(index, 'stay', e.target.value)}
                                            style={{ fontSize: '0.85rem' }}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Activities (One per line)..."
                                        value={Array.isArray(day.activities) ? day.activities.join('\n') : (day.description || '')}
                                        onChange={e => {
                                            // Split by newline to create array
                                            const val = e.target.value;
                                            const lines = val.split('\n'); // Keep empty lines if user is typing
                                            updateItineraryDay(index, 'activities', lines);
                                        }}
                                        rows={4}
                                    />
                                </div>
                            ))}
                            <button type="button" className="secondary-btn" onClick={addItineraryDay}>+ Add Day</button>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="add-btn">Save Package</button>
                            <button type="button" className="delete-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="item-list">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={filteredPackages.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            {filteredPackages.map((pkg) => (
                                <SortableItem
                                    key={pkg.id}
                                    id={pkg.id}
                                    pkg={pkg}
                                    onDelete={handleDelete}
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
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

export default PackageManager;
