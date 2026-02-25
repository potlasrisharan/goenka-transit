import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';

export default function StudentComplaints() {
    const { user } = useAuth();
    const { complaints, addComplaint } = useTransport();
    const [category, setCategory] = useState('Seat');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const myComplaints = complaints.filter(c => c.studentId === user.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        addComplaint({
            studentId: user.id,
            studentName: user.name,
            busId: user.busId,
            category,
            subject,
            description,
        });
        setSubject('');
        setDescription('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Report an Issue</h1>
                <p>Submit a complaint about your bus, seat, driver, or conductor</p>
            </div>

            <div className="dashboard-grid">
                {/* Submit form */}
                <motion.div className="glass-panel" style={{ padding: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-md)' }}>📝 New Complaint</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option>Seat</option>
                                <option>Driver</option>
                                <option>Conductor</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input type="text" className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject of your complaint" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." required />
                        </div>
                        <motion.button
                            type="submit"
                            style={{ padding: '12px 24px', background: 'var(--accent-primary)', color: 'white', borderRadius: 'var(--border-radius-md)', fontWeight: 600 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Submit Complaint
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: 'var(--border-radius-sm)', color: 'var(--accent-success)', fontSize: 'var(--fs-sm)' }}
                            >
                                ✅ Complaint submitted successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* History */}
                <motion.div className="glass-panel" style={{ padding: 'var(--space-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-md)' }}>📋 My Complaints ({myComplaints.length})</h3>
                    {myComplaints.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>No complaints submitted yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {myComplaints.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{c.subject}</span>
                                        <span className={`badge badge-${c.status === 'pending' ? 'warning' : c.status === 'in_progress' ? 'info' : 'success'}`}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>{c.category} • {c.date}</p>
                                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{c.description}</p>
                                    {c.response && (
                                        <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(0,206,201,0.06)', borderRadius: '6px', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                                            <strong>Response:</strong> {c.response}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
