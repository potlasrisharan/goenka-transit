import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransport } from '../../context/TransportContext';
import './TransportDashboard.css';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function TransportDashboard() {
    const { buses, drivers, complaints, routes, students, busChangeRequests, industrialVisits } = useTransport();
    const navigate = useNavigate();
    const activeBuses = buses.filter(b => b.status === 'active');
    const pendingComplaints = complaints.filter(c => c.status === 'pending');
    const pendingChanges = busChangeRequests.filter(r => r.status === 'pending');
    const pendingVisits = (industrialVisits || []).filter(v => v.status === 'pending');

    const stats = [
        { label: 'Total Buses', value: buses.length, icon: '🚌', accent: '#6c5ce7', path: '/transport/tracking' },
        { label: 'Active Routes', value: activeBuses.length, icon: '🛣️', accent: '#00cec9', path: '/transport/route-management' },
        { label: 'Students Enrolled', value: students.length || '—', icon: '🎓', accent: '#fd79a8', path: '/transport/students' },
        { label: 'Active Drivers', value: drivers.filter(d => d.status === 'on_duty').length, icon: '🧑‍✈️', accent: '#fdcb6e', path: '/transport/drivers' },
        { label: 'Pending Complaints', value: pendingComplaints.length, icon: '⚠️', accent: '#e17055', path: '/transport/complaints' },
        { label: 'Total Routes', value: routes.length, icon: '📍', accent: '#00b894', path: '/transport/route-management' },
        { label: 'Bus Change Requests', value: pendingChanges.length, icon: '🔄', accent: '#a29bfe', path: '/transport/bus-changes' },
        { label: 'Visit Requests', value: pendingVisits.length, icon: '🏭', accent: '#fab1a0', path: '/transport/visit-requests' },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Transport Command Center</h1>
                <p>Real-time overview of your entire fleet operations</p>
            </div>

            <motion.div className="stats-row" variants={container} initial="hidden" animate="show">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="stat-card glass-panel"
                        variants={item}
                        whileHover={{ y: -3, boxShadow: `0 8px 30px ${stat.accent}20` }}
                        style={{ '--stat-accent': stat.accent, cursor: 'pointer' }}
                        onClick={() => navigate(stat.path)}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="dashboard-grid" style={{ marginTop: 'var(--space-xl)' }}>
                <motion.div className="glass-panel quick-section" variants={item} initial="hidden" animate="show">
                    <h3>🚌 Fleet Status</h3>
                    <div className="fleet-list">
                        {buses.map(bus => {
                            const driver = drivers.find(d => d.busId === bus.id);
                            return (
                                <div key={bus.id} className="fleet-item">
                                    <div className="fleet-bus-info">
                                        <span className="fleet-bus-number">{bus.number}</span>
                                        <span className="fleet-bus-name">{bus.name}</span>
                                    </div>
                                    <div className="fleet-meta">
                                        <span className="fleet-driver">{driver?.name || '—'}</span>
                                        <span className={`badge ${bus.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                            {bus.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div className="glass-panel quick-section" variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                    <h3>📋 Recent Complaints</h3>
                    <div className="recent-complaints">
                        {complaints.slice(0, 4).map(c => (
                            <div key={c.id} className="complaint-preview">
                                <div className="complaint-preview-header">
                                    <span className="complaint-student">{c.studentName}</span>
                                    <span className={`badge badge-${c.status === 'pending' ? 'warning' : c.status === 'in_progress' ? 'info' : 'success'}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="complaint-subject">{c.subject}</p>
                                <span className="complaint-date">{c.date}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
