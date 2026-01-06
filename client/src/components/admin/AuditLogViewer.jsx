import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AuditLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/audit');
            setLogs(res.data);
        } catch (error) {
            console.error("Failed to fetch audit logs");
        } finally {
            setLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (window.confirm("Clear all audit logs? This cannot be undone.")) {
            try {
                await api.delete('/audit');
                fetchLogs();
            } catch (error) {
                console.error("Failed to clear logs");
            }
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) return <div>Loading Activity Logs...</div>;

    if (logs.length === 0) return null; // Don't show if empty? Or show "No activity"

    return (
        <div className="item-list" style={{ marginTop: 40 }}>
            <div className="list-item" style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Security Audit Logs</h3>
                    <button onClick={handleClearLogs} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        Clear Logs
                    </button>
                </div>
                <p style={{ color: '#666', marginBottom: 20 }}>
                    Track sensitive actions performed by admins.
                </p>

                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 8 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                            <tr>
                                <th style={{ padding: 10, textAlign: 'left' }}>Time</th>
                                <th style={{ padding: 10, textAlign: 'left' }}>Admin</th>
                                <th style={{ padding: 10, textAlign: 'left' }}>Action</th>
                                <th style={{ padding: 10, textAlign: 'left' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: 10, color: '#64748b' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td style={{ padding: 10, fontWeight: 600 }}>{log.admin.username} ({log.admin.role})</td>
                                    <td style={{ padding: 10 }}>
                                        <span style={{
                                            background: log.action.includes('DELETE') ? '#fee2e2' : '#dbeafe',
                                            color: log.action.includes('DELETE') ? '#991b1b' : '#1e40af',
                                            padding: '2px 6px', borderRadius: 4, fontSize: 11
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: 10, color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {log.details ? JSON.parse(log.details).name : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogViewer;
