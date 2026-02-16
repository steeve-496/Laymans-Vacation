import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './admin.css';

const AdminLayout = () => {
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                navigate('/admin/login');
            }
        };
        checkAuth();
    }, [navigate]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token'); // Clear Bearer token
            navigate('/admin/login');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>Loading Admin...</div>;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getPageTitle = () => {
        if (location.pathname.includes('destinations')) return 'Destination Manager';
        if (location.pathname.includes('packages')) return 'Package Manager';
        if (location.pathname.includes('state-explorer')) return 'State Explorer Manager';
        if (location.pathname.includes('blogs')) return 'Blog Manager';
        if (location.pathname.includes('gallery')) return 'Gallery Manager';
        if (location.pathname.includes('activity-logs')) return 'Activity Logs';
        if (location.pathname.includes('trash')) return 'Recycle Bin';
        return 'Dashboard Overview';
    };

    return (
        <div className="admin-layout admin-scope">
            {/* Mobile Overlay */}
            <div
                className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2>THE LAYMANS<br />ADMIN PANEL</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                    <Link to="/admin/destinations" className={`admin-nav-item ${location.pathname.includes('destinations') ? 'active' : ''}`}>
                        Destinations
                    </Link>
                    <Link to="/admin/packages" className={`admin-nav-item ${location.pathname.includes('packages') ? 'active' : ''}`}>
                        Packages
                    </Link>
                    <Link to="/admin/state-explorer" className={`admin-nav-item ${location.pathname.includes('state-explorer') ? 'active' : ''}`}>
                        State Explorer
                    </Link>

                    <div className="nav-divider" style={{ margin: '15px 0 5px 15px', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Content</div>

                    <Link to="/admin/blogs" className={`admin-nav-item ${location.pathname.includes('blogs') ? 'active' : ''}`}>
                        Blog / Journal
                    </Link>
                    <Link to="/admin/gallery" className={`admin-nav-item ${location.pathname.includes('gallery') ? 'active' : ''}`}>
                        Gallery Images
                    </Link>

                    <div className="nav-divider" style={{ margin: '15px 0 5px 15px', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>System</div>

                    {user && user.role === 'superadmin' && (
                        <>
                            <Link to="/admin/activity-logs" className={`admin-nav-item ${location.pathname.includes('activity-logs') ? 'active' : ''}`}>
                                Activity Logs
                            </Link>
                            <Link to="/admin/trash" className={`admin-nav-item ${location.pathname.includes('trash') ? 'active' : ''}`}>
                                Trash Bin
                            </Link>
                            <Link to="/admin/settings" className={`admin-nav-item ${location.pathname.includes('settings') ? 'active' : ''}`}>
                                Settings
                            </Link>
                        </>
                    )}
                </nav>

                <div className="admin-sidebar-footer">
                    <small style={{ opacity: 0.5 }}>v1.0.0</small>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="flex-center" style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <h1>{getPageTitle()}</h1>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </header>

                <div className="admin-content">
                    <Outlet context={{ user }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
