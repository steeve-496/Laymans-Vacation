import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ConfirmModal from './ConfirmModal';

const TrashBin = () => {
    const [deletedItems, setDeletedItems] = useState({
        destinations: [],
        packages: [],
        explorers: []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Modal State
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const [destRes, pkgRes, expRes] = await Promise.all([
                api.get('/destinations/trash'),
                api.get('/packages/trash'),
                api.get('/state-explorer/trash')
            ]);
            setDeletedItems({
                destinations: destRes.data,
                packages: pkgRes.data,
                explorers: expRes.data
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load trash');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (type, id) => {
        try {
            let endpoint = '';
            if (type === 'destination') endpoint = `/destinations/${id}/restore`;
            if (type === 'package') endpoint = `/packages/${id}/restore`;
            if (type === 'state-explorer') endpoint = `/state-explorer/${id}/restore`;

            await api.patch(endpoint);
            setMessage(`${type} restored successfully`);
            fetchTrash();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Restore failed');
        }
    };

    const handlePermanentDelete = async (type, id) => {
        setModal({
            isOpen: true,
            title: 'Delete Forever?',
            message: 'Are you sure you want to permanently delete this item? This action cannot be undone.',
            confirmText: 'Delete Forever',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    let endpoint = '';
                    if (type === 'destination') endpoint = `/destinations/${id}/permanent`;
                    if (type === 'package') endpoint = `/packages/${id}/permanent`;
                    if (type === 'state-explorer') endpoint = `/state-explorer/${id}/permanent`;

                    await api.delete(endpoint);
                    setMessage(`${type} permanently deleted`);
                    fetchTrash();
                    setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                    setError('Permanent delete failed');
                }
            }
        });
    };

    const handleEmptyTrash = async () => {
        setModal({
            isOpen: true,
            title: 'Empty Trash?',
            message: 'WARNING: This will permanently delete ALL items in the trash. This action CANNOT be undone. Are you sure?',
            confirmText: 'Empty Trash',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await Promise.all([
                        api.delete('/destinations/empty-trash'),
                        api.delete('/packages/empty-trash'),
                        api.delete('/state-explorer/empty-trash')
                    ]);
                    setMessage("Trash emptied successfully");
                    fetchTrash();
                    setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                    console.error(err);
                    setError("Failed to empty trash: " + (err.response?.data?.message || err.message));
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (loading) return <div>Loading Trash...</div>;

    const hasItems = deletedItems.destinations.length > 0 || deletedItems.packages.length > 0 || deletedItems.explorers.length > 0;

    return (
        <div className="item-list" style={{ marginTop: 40 }}>
            <div className="list-item" style={{ display: 'block' }}>
                <h3>Trash Bin</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <p style={{ color: '#666', margin: 0 }}>
                        Restore accidentally deleted items or permanently remove them.
                    </p>
                    {hasItems && (
                        <button
                            onClick={handleEmptyTrash}
                            style={{
                                padding: '8px 16px',
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            🗑️ Empty Trash
                        </button>
                    )}
                </div>

                {message && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}
                {error && <div className="error-msg">{error}</div>}

                {!hasItems && <div style={{ color: '#64748b', fontStyle: 'italic' }}>Trash is empty.</div>}

                {/* Destinations */}
                {deletedItems.destinations.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>Deleted Destinations</h4>
                        {deletedItems.destinations.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8f8f8' }}>
                                <div>
                                    <strong>{item.name}</strong>
                                    <div style={{ fontSize: 12, color: '#999' }}>Deleted: {new Date(item.deletedAt).toLocaleString()}</div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleRestore('destination', item.id)}
                                        style={{ marginRight: 8, padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete('destination', item.id)}
                                        style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Packages */}
                {deletedItems.packages.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>Deleted Packages</h4>
                        {deletedItems.packages.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8f8f8' }}>
                                <div>
                                    <strong>{item.title}</strong>
                                    <div style={{ fontSize: 12, color: '#999' }}>Deleted: {new Date(item.deletedAt).toLocaleString()}</div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleRestore('package', item.id)}
                                        style={{ marginRight: 8, padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete('package', item.id)}
                                        style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* State Explorers */}
                {deletedItems.explorers.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>Deleted State Explorers</h4>
                        {deletedItems.explorers.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8f8f8' }}>
                                <div>
                                    <strong>{item.name}</strong>
                                    <div style={{ fontSize: 12, color: '#999' }}>Deleted: {new Date(item.deletedAt).toLocaleString()}</div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleRestore('state-explorer', item.id)}
                                        style={{ marginRight: 8, padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete('state-explorer', item.id)}
                                        style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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

export default TrashBin;
