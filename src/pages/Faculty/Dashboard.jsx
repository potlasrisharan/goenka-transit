import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';
import './FacultyDashboard.css';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function FacultyDashboard() {
    const { user } = useAuth();
    const { industrialVisits, buses } = useTransport();

    // Find this faculty's latest approved visit
    const myVisits = industrialVisits.filter(v => (v.facultyId || v.faculty_id) === user.id);
    const approvedVisit = myVisits.find(v => v.status === 'approved');
    const pendingCount = myVisits.filter(v => v.status === 'pending').length;
    const approvedBus = approvedVisit?.busAssigned ? buses.find(b => b.id === approvedVisit.busAssigned) : null;

    // Build the visit route: College → [stops] → Destination
    const visitStops = approvedVisit ? [
        { name: 'G D Goenka Education City', label: 'PICKUP', type: 'start' },
        ...(approvedVisit.stops || []).map(s => ({ name: s, label: 'STOP', type: 'mid' })),
        { name: approvedVisit.destination, label: 'DESTINATION', type: 'end' },
    ] : [];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Welcome, {user.name} 👋</h1>
                <p>Faculty transport dashboard</p>
            </div>

            {/* Stats */}
            <motion.div className="stats-row" variants={container} initial="hidden" animate="show">
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{myVisits.length}</div>
                    <div className="stat-label">Total Requests</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{pendingCount}</div>
                    <div className="stat-label">Pending</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">{approvedVisit ? '🚌' : '—'}</div>
                    <div className="stat-value" style={{ fontSize: 'var(--fs-lg)' }}>{approvedBus?.number || '—'}</div>
                    <div className="stat-label">Assigned Bus</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">✅</div>
                    <div className="stat-value" style={{ fontSize: 'var(--fs-xl)' }}>{user.feePaid ? 'Paid' : 'Due'}</div>
                    <div className="stat-label">Fee Status</div>
                </motion.div>
            </motion.div>

            <div className="dashboard-grid" style={{ marginTop: 'var(--space-xl)' }}>
                {/* Approved Visit Route — main card */}
                <motion.div className="glass-panel fd-section" variants={item} initial="hidden" animate="show">
                    <h3>🛣️ Current Visit Route</h3>
                    {approvedVisit ? (
                        <div className="fd-visit-route">
                            <div className="fd-visit-header">
                                <span className="fd-visit-dest">{approvedVisit.destination}</span>
                                <span className="badge badge-success">Approved</span>
                            </div>
                            <div className="fd-visit-meta">
                                <span>📅 {approvedVisit.date || approvedVisit.visit_date}</span>
                                <span>👥 {approvedVisit.students || approvedVisit.num_students} students</span>
                                {approvedBus && <span>🚌 {approvedBus.number}</span>}
                            </div>

                            {/* Route timeline: College → stops → Destination */}
                            <div className="fd-route-timeline">
                                {visitStops.map((stop, i) => (
                                    <div key={i} className="fd-route-stop">
                                        <div className={`fd-route-dot ${stop.type}`} />
                                        {i < visitStops.length - 1 && <div className="fd-route-connector" />}
                                        <div className="fd-route-info">
                                            <span className="fd-route-label">{stop.label}</span>
                                            <span className="fd-route-name">{stop.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="fd-empty">
                            <span>📭</span>
                            <p>No approved visit yet. Submit a request from <strong>Industrial Visits</strong>.</p>
                        </div>
                    )}
                </motion.div>

                {/* Recent Requests */}
                <motion.div className="glass-panel fd-section" variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                    <h3>📋 Recent Requests</h3>
                    {myVisits.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>No visit requests yet.</p>
                    ) : (
                        <div className="fd-requests-list">
                            {myVisits.slice(0, 5).map((v, i) => {
                                const vBus = v.busAssigned ? buses.find(b => b.id === v.busAssigned) : null;
                                const vStops = [
                                    'G D Goenka Education City',
                                    ...(v.stops || []),
                                    v.destination,
                                ];
                                return (
                                    <div key={v.id || i} className="fd-req-card">
                                        <div className="fd-req-header">
                                            <h4>{v.destination}</h4>
                                            <span className={`badge badge-${v.status === 'approved' ? 'success' : v.status === 'pending' ? 'warning' : 'danger'}`}>
                                                {v.status}
                                            </span>
                                        </div>
                                        <div className="fd-req-meta">
                                            <span>📅 {v.date || v.visit_date}</span>
                                            <span>👥 {v.students || v.num_students}</span>
                                            {vBus && <span>🚌 {vBus.number}</span>}
                                        </div>
                                        {/* Mini route: College → [stops] → Dest */}
                                        <div className="fd-mini-route">
                                            {vStops.map((s, j) => (
                                                <span key={j} className="fd-mini-stop">
                                                    {j > 0 && <span className="fd-mini-arrow">→</span>}
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
