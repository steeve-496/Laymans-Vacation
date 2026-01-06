import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmModal from './ConfirmModal';

const StateExplorerManager = ({ destinationId }) => {
    const [states, setStates] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentState, setCurrentState] = useState({ name: '', image: '', description: '', destinationId: destinationId || '' });
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

    const filteredStates = destinationId
        ? states.filter(s => s.destinationId === destinationId)
        : states;

    useEffect(() => {
        fetchStates();
        fetchDestinations();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await api.get('/state-explorer');
            setStates(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            setDestinations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        setModal({
            isOpen: true,
            title: 'Delete Entry?',
            message: 'Are you sure you want to delete this state entry?',
            confirmText: 'Delete',
            isDestructive: true,
            onConfirm: async () => {
                // Optimistic UI Update
                const previousStates = [...states];
                setStates(prev => prev.filter(s => s.id !== id));

                try {
                    await api.delete(`/state-explorer/${id}`);
                } catch (error) {
                    console.error('Failed to delete state:', error);
                    setStates(previousStates);
                    alert("Failed to delete. Please check your connection.");
                }
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentState.id) {
                await api.put(`/state-explorer/${currentState.id}`, currentState);
            } else {
                await api.post('/state-explorer', currentState);
            }
            setIsEditing(false);
            setCurrentState({ name: '', image: '', description: '', destinationId: '' });
            fetchStates();
        } catch (error) {
            console.error(error);
            alert("Failed to save. Ensure all fields are filled.");
        }
    };

    const getDestinationName = (id) => {
        const dest = destinations.find(d => d.id === id);
        return dest ? dest.name : 'Unknown';
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage State Explorer</h2>
                <button className="add-btn" onClick={() => { setCurrentState({ name: '', image: '', description: '', destinationId: destinations[0]?.id || '' }); setIsEditing(true); }}>+ Add New</button>
            </div>

            {isEditing ? (
                <div className="item-list">
                    <h3>{currentState.id ? 'Edit State Entry' : 'Add State Entry'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Name (e.g., Baku, Ubud)</label>
                            <input value={currentState.name} onChange={e => setCurrentState({ ...currentState, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Destination (Country/City)</label>
                            <select
                                value={currentState.destinationId}
                                onChange={e => setCurrentState({ ...currentState, destinationId: e.target.value })}
                                required
                            >
                                <option value="">Select Destination</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input value={currentState.image} onChange={e => setCurrentState({ ...currentState, image: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={currentState.description} onChange={e => setCurrentState({ ...currentState, description: e.target.value })} rows="3" />
                        </div>
                        <button type="submit" className="add-btn">Save</button>
                        <button type="button" className="delete-btn" style={{ marginLeft: 10 }} onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                </div>
            ) : (
                <div className="item-list">
                    {filteredStates.map(state => (
                        <div key={state.id} className="list-item mobile-compact-item">
                            <div className="item-info">
                                <img src={state.image} alt={state.name} className="item-thumb" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>{state.name}</strong>
                                    <small style={{ color: '#666' }}>{getDestinationName(state.destinationId)}</small>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button className="edit-btn" onClick={() => { setCurrentState(state); setIsEditing(true); }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(state.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Modal */}
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

export default StateExplorerManager;
