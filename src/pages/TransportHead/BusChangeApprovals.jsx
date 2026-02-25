import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import './BusChangeApprovals.css';

export default function BusChangeApprovals() {
    const { busChangeRequests, approveBusChange, buses } = useTransport();
    const [filter, setFilter] = useState('all');
    const [noteMap, setNoteMap] = useState({});

    const filtered = filter === 'all'
        ? busChangeRequests
        : busChangeRequests.filter(r => r.status === filter);

    const getBusName = (id) => {
        const bus = buses.find(b => b.id === id);
        return bus ? `${bus.number} – ${bus.name}` : id || '—';
    };

    const statusColors = { pending: '#fdcb6e', approved: '#00b894', rejected: '#e17055' };

    return (
        <motion.div className="approvals-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <h1>🔄 Bus Change Requests</h1>
                <p>Review and manage student bus reassignment requests</p>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'pending' && ` (${busChangeRequests.filter(r => r.status === 'pending').length})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No {filter !== 'all' ? filter : ''} bus change requests</p>
                </div>
            ) : (
                <div className="requests-list">
                    {filtered.map((req, i) => (
                        <motion.div
                            key={req.id || i}
                            className="request-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="request-header">
                                <div className="student-info">
                                    <span className="student-avatar">🧑‍🎓</span>
                                    <div>
                                        <h4>{req.student_name || req.studentName || 'Student'}</h4>
                                        <span className="student-id">{req.student_id || req.studentId}</span>
                                    </div>
                                </div>
                                <span className="request-status" style={{ color: statusColors[req.status], borderColor: statusColors[req.status] }}>
                                    {req.status?.toUpperCase()}
                                </span>
                            </div>

                            <div className="transfer-visual">
                                <div className="from-bus">
                                    <span className="label">Current</span>
                                    <span className="bus-name">{getBusName(req.current_bus_id || req.currentBusId)}</span>
                                </div>
                                <span className="arrow">→</span>
                                <div className="to-bus">
                                    <span className="label">Requested</span>
                                    <span className="bus-name">{getBusName(req.requested_bus_id || req.requestedBusId)}</span>
                                </div>
                            </div>

                            {req.reason && <p className="request-reason">💬 {req.reason}</p>}

                            {req.status === 'pending' && (
                                <div className="approval-actions">
                                    <input
                                        type="text"
                                        placeholder="Add a note (optional)..."
                                        value={noteMap[req.id] || ''}
                                        onChange={(e) => setNoteMap(p => ({ ...p, [req.id]: e.target.value }))}
                                        className="note-input"
                                    />
                                    <div className="action-btns">
                                        <button className="btn-approve" onClick={() => approveBusChange(req.id, true, noteMap[req.id])}>
                                            ✅ Approve
                                        </button>
                                        <button className="btn-reject" onClick={() => approveBusChange(req.id, false, noteMap[req.id])}>
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {req.admin_note && req.status !== 'pending' && (
                                <p className="admin-note">📝 Note: {req.admin_note}</p>
                            )}

                            <span className="request-date">
                                {req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
