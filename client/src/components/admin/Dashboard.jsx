import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import api from '../../utils/api';

const Dashboard = () => {
    const { user } = useOutletContext();
    const [stats, setStats] = useState({
        destinations: 0,
        packages: 0,
        states: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [destRes, pkgRes, stateRes] = await Promise.all([
                    api.get('/destinations/admin/all'),
                    api.get('/packages'),
                    api.get('/state-explorer')
                ]);

                setStats({
                    destinations: destRes.data.length,
                    packages: pkgRes.data.length,
                    states: stateRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    const StatCard = ({ title, count, link, color, icon }) => (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <div style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                cursor: 'pointer'
            }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <div>
                    <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b' }}>{count}</div>
                </div>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: color + '20', // 20% opacity
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                }}>
                    {icon}
                </div>
            </div>
        </Link>
    );

    return (
        <div>
            <div className="admin-section-header">
                <h2>Dashboard Overview</h2>
                <div style={{ color: '#64748b' }}>Welcome back, <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{user?.username || 'Admin'}</span></div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
            }}>
                <StatCard
                    title="Total Destinations"
                    count={stats.destinations}
                    link="/admin/destinations"
                    color="#2563eb"
                    icon="🌍"
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginTop: 0 }}>Quick Start Guide</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                    Use the sidebar to manage your content.
                    <br />• <strong>Destinations:</strong> Add countries or cities.
                    <br />• <strong>Packages:</strong> Create travel itineraries linked to destinations.
                    <br />• <strong>State Explorer:</strong> Add detailed location spots for the "Explore" view.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
