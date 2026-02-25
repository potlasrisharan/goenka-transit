import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';
import './BusChangeRequest.css';

export default function BusChangeRequest() {
    const { user } = useAuth();
    const { buses, routes, busChangeRequests, submitBusChangeRequest } = useTransport();
    const [requestedBusId, setRequestedBusId] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const currentBus = buses.find(b => b.id === (user?.busId || 'BUS01'));
    const myRequests = busChangeRequests.filter(r => (r.student_id || r.studentId) === user?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!requestedBusId || !reason.trim()) return;
        await submitBusChangeRequest({
            student_id: user?.id || 'STU001',
            student_name: user?.name || 'Student',
            current_bus_id: currentBus?.id || '',
            requested_bus_id: requestedBusId,
            reason: reason.trim(),
        });
        setSubmitted(true);
        setRequestedBusId('');
        setReason('');
        setTimeout(() => setSubmitted(false), 3000);
    };

    const getRouteName = (busId) => {
        const bus = buses.find(b => b.id === busId);
        if (!bus) return '';
        const route = routes.find(r => r.id === bus.routeId);
        return route ? route.name : '';
    };

    const statusColors = { pending: '#fdcb6e', approved: '#00b894', rejected: '#e17055' };

    return (
        <motion.div className="bus-change-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <h1>🔄 Request Bus Change</h1>
                <p>Submit a request to switch to a different bus route</p>
            </div>

            {currentBus && (
                <div className="current-bus-card">
                    <h3>Your Current Bus</h3>
                    <div className="current-bus-info">
                        <span className="bus-badge">{currentBus.number}</span>
                        <div>
                            <strong>{currentBus.name}</strong>
                            <p>{getRouteName(currentBus.id)}</p>
                        </div>
                    </div>
                </div>
            )}

            <motion.form className="change-form glass-card" onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3>📝 New Request</h3>

                <div className="form-group">
                    <label>Select Desired Bus/Route</label>
                    <select value={requestedBusId} onChange={(e) => setRequestedBusId(e.target.value)} required>
                        <option value="">-- Choose a bus --</option>
                        {buses.filter(b => b.id !== currentBus?.id && b.status === 'active').map(bus => (
                            <option key={bus.id} value={bus.id}>
                                {bus.number} – {bus.name} ({getRouteName(bus.id)})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Reason for Change</label>
                    <textarea
                        value={reason} onChange={(e) => setReason(e.target.value)}
                        placeholder="Explain why you need a bus change (e.g., moved to a new area, schedule conflict)..."
                        rows={4} required
                    />
                </div>

                <button type="submit" className="btn-submit" disabled={submitted}>
                    {submitted ? '✅ Request Submitted!' : '📤 Submit Request'}
                </button>
            </motion.form>

            {myRequests.length > 0 && (
                <motion.div className="history-section"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h3>📋 Your Request History</h3>
                    <div className="history-list">
                        {myRequests.map((req, i) => (
                            <div key={req.id || i} className="history-item">
                                <div className="history-header">
                                    <span className="history-status" style={{ color: statusColors[req.status], borderColor: statusColors[req.status] }}>
                                        {req.status?.toUpperCase()}
                                    </span>
                                    <span className="history-date">
                                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <p className="history-transfer">
                                    {req.current_bus_id || req.currentBusId} → {req.requested_bus_id || req.requestedBusId}
                                </p>
                                <p className="history-reason">{req.reason}</p>
                                {req.admin_note && (
                                    <p className="history-note">📝 Admin: {req.admin_note}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
