import { motion } from 'framer-motion';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -70 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
            <div className="navbar-left">
                <button className="navbar-toggle" onClick={onToggleSidebar} id="sidebar-toggle">
                    <span></span><span></span><span></span>
                </button>
                <div className="navbar-brand">
                    <span className="brand-icon">🚌</span>
                    <div>
                        <h1 className="brand-name">Goenka Transit</h1>
                        <span className="brand-sub">Campus Transport System</span>
                    </div>
                </div>
            </div>
            <div className="navbar-right">
                <div className="navbar-status">
                    <span className="status-dot"></span>
                    <span className="status-text">System Online</span>
                </div>
                {user && (
                    <div className="navbar-user">
                        <span className="user-avatar">{user.avatar}</span>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role.replace('_', ' ')}</span>
                        </div>
                        <button className="logout-btn" onClick={logout} id="logout-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
