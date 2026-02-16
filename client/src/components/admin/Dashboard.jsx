import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../admin/admin.css';
import api from '../../utils/api';

const Dashboard = () => {
    const [adminUser, setAdminUser] = useState(null);
    const [stats, setStats] = useState({
        destinations: 0,
        packages: 0,
        blogs: 0,
        activity: 0
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setAdminUser(res.data);

                // Fetch some basic stats
                // These endpoints need to exist or we use separate calls
                // For now, placeholder or separate calls if available
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    if (!adminUser) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="dashboard-overview">
            <div className="welcome-banner">
                <h2>Welcome back, {adminUser.username}!</h2>
                <p>Manage your website content and settings from here.</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Quick Links</h3>
                    <div className="quick-links">
                        <Link to="/admin/destinations" className="quick-link-btn">Manage Destinations</Link>
                        <Link to="/admin/blogs" className="quick-link-btn">Write a Blog Post</Link>
                        <Link to="/admin/gallery" className="quick-link-btn">Update Gallery</Link>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>System Status</h3>
                    <p><strong>Role:</strong> {adminUser.role}</p>
                    <p><strong>Server:</strong> Online</p>
                    <p><strong>Database:</strong> Connected</p>
                </div>
            </div>

            <style jsx>{`
                .dashboard-overview {
                    padding: 20px;
                }
                .welcome-banner {
                    background: #fff;
                    padding: 30px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .welcome-banner h2 {
                    margin: 0 0 10px 0;
                    color: #1a1a1a;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }
                .dashboard-card {
                    background: #fff;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .quick-links {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 15px;
                }
                .quick-link-btn {
                    padding: 12px;
                    background: #f8fafc;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    transition: all 0.2s;
                    border: 1px solid #e2e8f0;
                }
                .quick-link-btn:hover {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                    color: #2563eb;
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
