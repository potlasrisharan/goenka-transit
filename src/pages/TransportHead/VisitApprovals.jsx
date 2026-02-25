import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import './VisitApprovals.css';

export default function VisitApprovals() {
    const { industrialVisits, approveVisitRequest, updateVisitStatus, buses } = useTransport();
    const [filter, setFilter] = useState('all');
    const [busMap, setBusMap] = useState({});
    const [noteMap, setNoteMap] = useState({});

    const filtered = filter === 'all'
        ? industrialVisits
        : industrialVisits.filter(v => v.status === filter);

    const statusColors = { pending: '#fdcb6e', approved: '#00b894', rejected: '#e17055', completed: '#74b9ff' };

    const handleApprove = (id) => {
        const busId = busMap[id];
        if (!busId) { alert('Please select a bus to assign'); return; }
        approveVisitRequest(id, busId, noteMap[id] || '');
    };

    const handleReject = (id) => {
        updateVisitStatus(id, 'rejected');
    };

    return (
        <motion.div className="visit-approvals-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <h1>🏭 Industrial Visit Requests</h1>
                <p>Approve or reject faculty requests for bus allocation</p>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'pending' && ` (${industrialVisits.filter(v => v.status === 'pending').length})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state glass-panel">
                    <span style={{ fontSize: '2.5rem' }}>📭</span>
                    <p>No {filter === 'all' ? '' : filter} visit requests</p>
                </div>
            ) : (
                <div className="visits-list">
                    {filtered.map((v, i) => (
                        <motion.div key={v.id || i} className="visit-card glass-panel"
                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <div className="visit-header">
                                <div className="faculty-info">
                                    <h4>🧑‍🏫 {v.facultyName || v.faculty_name || 'Faculty'}</h4>
                                    <span className="faculty-id">{v.facultyId || v.faculty_id}</span>
                                </div>
                                <span className="visit-status" style={{ color: statusColors[v.status], borderColor: statusColors[v.status] }}>
                                    {v.status?.toUpperCase()}
                                </span>
                            </div>

                            <div className="visit-details">
                                <div className="detail-item">
                                    <span className="detail-label">📍 Destination</span>
                                    <span className="detail-value">{v.destination}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">📅 Date</span>
                                    <span className="detail-value">{v.date || v.visit_date}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">👥 Students</span>
                                    <span className="detail-value">{v.students || v.num_students}</span>
                                </div>
                            </div>

                            {v.purpose && <p className="visit-purpose">💬 {v.purpose}</p>}

                            {v.status === 'pending' && (
                                <div className="approval-actions">
                                    <div className="assign-row">
                                        <label>Assign Bus:</label>
                                        <select value={busMap[v.id] || ''} onChange={(e) => setBusMap(p => ({ ...p, [v.id]: e.target.value }))}>
                                            <option value="">-- Select bus --</option>
                                            {buses.filter(b => b.status === 'active').map(b => (
                                                <option key={b.id} value={b.id}>{b.number} – {b.name} ({b.capacity} seats)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input type="text" placeholder="Add a note (optional)..."
                                        value={noteMap[v.id] || ''}
                                        onChange={(e) => setNoteMap(p => ({ ...p, [v.id]: e.target.value }))}
                                        className="note-input"
                                    />
                                    <div className="action-btns">
                                        <button className="btn-approve" onClick={() => handleApprove(v.id)}>✅ Approve & Assign Bus</button>
                                        <button className="btn-reject" onClick={() => handleReject(v.id)}>❌ Reject</button>
                                    </div>
                                </div>
                            )}

                            {v.status === 'approved' && v.busAssigned && (() => {
                                const routeStops = [
                                    { name: 'G D Goenka Education City', label: 'PICKUP', type: 'start' },
                                    ...(v.stops || []).map((s, j) => ({ name: s, label: `STOP ${j + 1}`, type: 'mid' })),
                                    { name: v.destination, label: 'DESTINATION', type: 'end' },
                                ];
                                return (
                                    <div className="approved-route-card">
                                        <h5>🚌 Temporary Route for {v.date || v.visit_date} ({routeStops.length} stops)</h5>
                                        <div className="temp-route-stops" style={{ flexDirection: 'column', gap: 0 }}>
                                            {routeStops.map((stop, j) => (
                                                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', position: 'relative', paddingBottom: '6px' }}>
                                                    <div className={`stop-dot ${stop.type === 'start' ? 'start' : stop.type === 'end' ? 'end' : ''}`} style={stop.type === 'mid' ? { background: '#fdcb6e', border: '2px solid #ffeaa7' } : {}} />
                                                    {j < routeStops.length - 1 && <div style={{ position: 'absolute', left: 5, top: 16, bottom: 0, width: 2, background: 'repeating-linear-gradient(180deg, var(--text-muted) 0, var(--text-muted) 3px, transparent 3px, transparent 6px)' }} />}
                                                    <div className="stop-info">
                                                        <span className="stop-label">{stop.label}</span>
                                                        <span className="stop-name">{stop.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="temp-route-meta">
                                            <span>🚌 {buses.find(b => b.id === v.busAssigned)?.number || v.busAssigned}</span>
                                            <span>👥 {v.students || v.num_students} students</span>
                                            <span>📅 {v.date || v.visit_date}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <span className="visit-date-meta">{v.createdAt || v.created_at?.split('T')[0] || ''}</span>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
