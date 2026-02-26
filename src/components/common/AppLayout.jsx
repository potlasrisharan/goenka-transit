import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import './AppLayout.css';

const MOBILE_BREAKPOINT = 768;

export default function AppLayout() {
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
    const location = useLocation();

    // Auto-close sidebar on route change when on mobile
    useEffect(() => {
        if (isMobile()) setSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar when resizing down to mobile
    useEffect(() => {
        const handleResize = () => {
            if (isMobile()) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <div className="app-layout">
            <AnimatedBackground />
            <Navbar onToggleSidebar={() => setSidebarOpen(p => !p)} />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <main className={`main-content ${sidebarOpen ? 'main-sidebar-open' : 'main-sidebar-closed'}`}>
                <Outlet />
            </main>
        </div>
    );
}
