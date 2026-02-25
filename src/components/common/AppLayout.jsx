import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import './AppLayout.css';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="app-layout">
            <AnimatedBackground />
            <Navbar onToggleSidebar={() => setSidebarOpen(p => !p)} />
            <Sidebar isOpen={sidebarOpen} />
            <main className={`main-content ${sidebarOpen ? 'main-sidebar-open' : 'main-sidebar-closed'}`}>
                <Outlet />
            </main>
        </div>
    );
}
