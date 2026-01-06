import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Settings = () => {
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [currentUser, setCurrentUser] = useState(null);

    const [editingAdmin, setEditingAdmin] = useState(null);

    useEffect(() => {
        fetchAdmins();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setCurrentUser(res.data);
            if (res.data.role !== 'superadmin') {
                window.location.href = '/admin/dashboard';
            }
        } catch (error) {
            console.error("Failed to fetch current user");
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/auth/list');
            setAdmins(res.data);
        } catch (err) {
            console.error("Failed to fetch admins");
            setError("Failed to load admin list. Please refresh or check console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
                await api.delete(`/auth/delete/${id}`);
                setMessage("Admin deleted");
                fetchAdmins();
                if (editingAdmin && editingAdmin.id === id) {
                    setEditingAdmin(null);
                    setFormData({ username: '', password: '', confirmPassword: '', role: 'admin' });
                }
            } catch (err) {
                setError(err.response?.data?.message || "Delete failed");
            }
        }
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            username: admin.username,
            email: admin.email || '',
            password: '',
            confirmPassword: '',
            role: admin.role
        });
        setMessage('');
        setError('');
        // Scroll to form
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingAdmin(null);
        setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'admin' });
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            if (editingAdmin) {
                // Update existing
                await api.put(`/auth/update/${editingAdmin.id}`, {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password || undefined, // Only send if set
                    role: formData.role
                });
                setMessage(`Admin '${formData.username}' updated successfully!`);
                setEditingAdmin(null);
            } else {
                // Create new
                await api.post('/auth/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
                setMessage(`Admin '${formData.username}' created successfully!`);
            }

            setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'admin' });
            fetchAdmins();
        } catch (err) {
            setError(err.response?.data?.message || (editingAdmin ? "Failed to update admin" : "Failed to create admin"));
        }
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Admin Settings</h2>
            </div>

            <div className="item-list" style={{ marginBottom: 40 }}>
                <div className="list-item" style={{ display: 'block' }}>
                    <h3>Manage Admins</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: 10 }}>Username</th>
                                <th style={{ padding: 10 }}>Email</th>
                                <th style={{ padding: 10 }}>Role</th>
                                <th style={{ padding: 10 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map(admin => (
                                <tr key={admin.id} style={{ borderBottom: '1px solid #f8f8f8', background: editingAdmin?.id === admin.id ? '#f0f9ff' : 'transparent' }}>
                                    <td style={{ padding: 10 }}>
                                        {admin.username}
                                        {currentUser && currentUser.id === admin.id && <span style={{ marginLeft: 8, fontSize: 11, color: '#666', background: '#e5e7eb', padding: '2px 6px', borderRadius: 4 }}>You</span>}
                                    </td>
                                    <td style={{ padding: 10 }}>{admin.email || '-'}</td>
                                    <td style={{ padding: 10 }}>
                                        <span style={{
                                            background: admin.role === 'superadmin' ? '#dbeafe' : '#f3f4f6',
                                            color: admin.role === 'superadmin' ? '#1e40af' : '#374151',
                                            padding: '2px 8px', borderRadius: 4, fontSize: 12
                                        }}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: 10 }}>
                                        <button
                                            className="edit-btn small"
                                            onClick={() => handleEdit(admin)}
                                            style={{ marginRight: 8, padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        {currentUser && currentUser.id !== admin.id && (
                                            <button className="delete-btn small" onClick={() => handleDelete(admin.id)}>Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="item-list">
                <div className="list-item" style={{ display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>{editingAdmin ? 'Edit Admin Account' : 'Create New Admin Account'}</h3>
                        {editingAdmin && (
                            <button onClick={handleCancelEdit} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <p style={{ color: '#666', marginBottom: 20 }}>
                        {editingAdmin ? 'Update the details below. Leave password blank to keep current password.' : 'Add a new user who will have access to this admin panel.'}
                    </p>

                    {message && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}
                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: 0, border: 'none' }}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email (For Password Recovery)</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="e.g. admin@layman.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: 16 }}
                            >
                                <option value="admin">Admin</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Password {editingAdmin && '(Leave blank to keep current)'}</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required={!editingAdmin}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required={!editingAdmin || formData.password.length > 0}
                            />
                        </div>
                        <button type="submit" className="add-btn">
                            {editingAdmin ? 'Update Admin' : 'Create Admin'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
