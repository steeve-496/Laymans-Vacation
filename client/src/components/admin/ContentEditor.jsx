import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentEditor = () => {
    // State Explorer Handling (Similar to others but maybe simpler or just list)
    // For brevity, I'll limit this to managing "State Explorer" items list.
    // If generic content editing is needed, it can be expanded here.

    // Actually, user asked for "change names of countries and images" -> Destination Manager covers this? 
    // "Content details in destination, state-explorer" -> Destination Manager covers destination. 
    // So this is for State Explorer.

    const [states, setStates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentState, setCurrentState] = useState({ stateName: '', image: '' });

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        const res = await axios.get('http://localhost:5000/api/content/states');
        setStates(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this state?')) {
            await axios.delete(`http://localhost:5000/api/content/states/${id}`, { withCredentials: true });
            fetchStates();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentState.id) {
                await axios.put(`http://localhost:5000/api/content/states/${currentState.id}`, currentState, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/api/content/states', currentState, { withCredentials: true });
            }
            setIsEditing(false);
            setCurrentState({ stateName: '', image: '' });
            fetchStates();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <h2>Manage State Explorer</h2>
                <button className="add-btn" onClick={() => { setCurrentState({ stateName: '', image: '' }); setIsEditing(true); }}>+ Add New</button>
            </div>

            {isEditing ? (
                <div className="item-list">
                    <h3>{currentState.id ? 'Edit State' : 'Add State'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>State Name</label>
                            <input value={currentState.stateName} onChange={e => setCurrentState({ ...currentState, stateName: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input value={currentState.image} onChange={e => setCurrentState({ ...currentState, image: e.target.value })} required />
                        </div>
                        <button type="submit" className="add-btn">Save</button>
                        <button type="button" className="delete-btn" style={{ marginLeft: 10 }} onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                </div>
            ) : (
                <div className="item-list">
                    {states.map(state => (
                        <div key={state.id} className="list-item">
                            <div className="item-info">
                                <img src={state.image} alt={state.stateName} className="item-thumb" />
                                <strong>{state.stateName}</strong>
                            </div>
                            <div className="item-actions">
                                <button className="edit-btn" onClick={() => { setCurrentState(state); setIsEditing(true); }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(state.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentEditor;
