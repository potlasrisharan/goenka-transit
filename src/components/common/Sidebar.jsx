import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = {
    transport_head: [
        { path: '/transport/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/transport/tracking', icon: '🗺️', label: 'Bus Tracking' },
        { path: '/transport/route-management', icon: '🛣️', label: 'Route Management' },
        { path: '/transport/drivers', icon: '🧑‍✈️', label: 'Driver Details' },
        { path: '/transport/complaints', icon: '📋', label: 'Complaints' },
        { path: '/transport/students', icon: '🎓', label: 'Student & Seats' },
        { path: '/transport/bus-changes', icon: '🔄', label: 'Bus Changes' },
        { path: '/transport/visit-requests', icon: '🏭', label: 'Visit Requests' },
    ],
    student: [
        { path: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/student/seat-booking', icon: '💺', label: 'Seat Booking' },
        { path: '/student/bus-change', icon: '🔄', label: 'Change Bus' },
        { path: '/student/complaints', icon: '📝', label: 'Complaints' },
        { path: '/student/share-location', icon: '📍', label: 'Share with Parent' },
    ],
    faculty: [
        { path: '/faculty/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/faculty/industrial-visits', icon: '🏭', label: 'Industrial Visits' },
    ],
};

export default function Sidebar({ isOpen, onClose }) {
    const { user } = useAuth();
    const location = useLocation();
    const isMobile = window.innerWidth <= 768;

    if (!user) return null;
    const items = menuItems[user.role] || [];

    const handleNavClick = () => {
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    };

    // On mobile, animate sidebar in/out via Framer Motion x
    // On desktop, always keep x at 0 and let CSS width handle collapse
    const sidebarVariants = {
        open: { x: 0 },
        closed: isMobile ? { x: -280 } : { x: 0 },
    };

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && isMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <motion.aside
                className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                variants={sidebarVariants}
                initial={isMobile ? 'closed' : 'open'}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="sidebar-header">
                    <div className="sidebar-role-badge">
                        <span className="role-icon">{user.avatar}</span>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="role-details"
                            >
                                <span className="role-label">{user.role.replace('_', ' ')}</span>
                                <span className="role-id">{user.id}</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                                    }
                                    id={`nav-${item.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                                    onClick={handleNavClick}
                                >
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    {isOpen && <span className="sidebar-link-label">{item.label}</span>}
                                    {location.pathname === item.path && (
                                        <motion.div
                                            className="sidebar-active-indicator"
                                            layoutId="activeTab"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </NavLink>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>

                {isOpen && (
                    <div className="sidebar-footer">
                        <div className="sidebar-footer-text">
                            <span>Goenka Transit v1.0</span>
                            <span>© 2026 Binary Brains</span>
                        </div>
                    </div>
                )}
            </motion.aside>
        </>
    );
}
