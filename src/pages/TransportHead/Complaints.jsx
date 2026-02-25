import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import './Complaints.css';

export default function ComplaintsManagement() {
    const { complaints, updateComplaintStatus } = useTransport();
    const [filter, setFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [response, setResponse] = useState('');

    const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

    const handleRespond = (id) => {
        if (response.trim()) {
            updateComplaintStatus(id, 'in_progress', response);
            setResponse('');
            setSelectedComplaint(null);
        }
    };

    const handleResolve = (id) => {
        updateComplaintStatus(id, 'resolved', 'Issue has been resolved.');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Complaints Center</h1>
                <p>View and manage student-reported issues</p>
            </div>

            <div className="complaints-filters glass-panel">
                {['all', 'pending', 'in_progress', 'resolved'].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'filter-btn-active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f.replace('_', ' ')}
                        <span className="filter-count">
                            {f === 'all' ? complaints.length : complaints.filter(c => c.status === f).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="complaints-list">
                <AnimatePresence>
                    {filtered.map((c, i) => (
                        <motion.div
                            key={c.id}
                            className="complaint-card glass-panel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="cc-header">
                                <div className="cc-student-info">
                                    <span className="cc-id">{c.id}</span>
                                    <h4>{c.subject}</h4>
                                    <span className="cc-meta">By {c.studentName} • Bus {c.busId} • {c.date}</span>
                                </div>
                                <div className="cc-actions">
                                    <span className={`badge badge-${c.status === 'pending' ? 'warning' : c.status === 'in_progress' ? 'info' : 'success'}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="cc-body">
                                <span className={`badge badge-info`} style={{ marginBottom: '8px' }}>📂 {c.category}</span>
                                <p>{c.description}</p>
                            </div>

                            {c.response && (
                                <div className="cc-response">
                                    <strong>Response:</strong> {c.response}
                                </div>
                            )}

                            {c.status !== 'resolved' && (
                                <div className="cc-footer">
                                    {selectedComplaint === c.id ? (
                                        <div className="cc-respond-form">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Type your response..."
                                                value={response}
                                                onChange={(e) => setResponse(e.target.value)}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="cc-btn cc-btn-send" onClick={() => handleRespond(c.id)}>Send</button>
                                                <button className="cc-btn cc-btn-cancel" onClick={() => setSelectedComplaint(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="cc-btn cc-btn-respond" onClick={() => setSelectedComplaint(c.id)}>Respond</button>
                                            <button className="cc-btn cc-btn-resolve" onClick={() => handleResolve(c.id)}>Mark Resolved</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
