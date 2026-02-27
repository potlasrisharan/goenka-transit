import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';
import './IndustrialVisits.css';

const BUS_CAPACITY = 51;

export default function IndustrialVisits() {
    const { user } = useAuth();
    const { industrialVisits, addVisitRequest, buses } = useTransport();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [students, setStudents] = useState('');
    const [purpose, setPurpose] = useState('');
    const [stops, setStops] = useState([]);
    const [newStop, setNewStop] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [validationError, setValidationError] = useState('');

    const myVisits = industrialVisits.filter(v => (v.facultyId || v.faculty_id) === user.id);

    // Today's date in YYYY-MM-DD for min attribute
    const today = new Date().toISOString().split('T')[0];

    // Calculate buses needed
    const numStudents = parseInt(students) || 0;
    const busesNeeded = numStudents > 0 ? Math.ceil(numStudents / BUS_CAPACITY) : 0;

    const addStop = () => {
        if (newStop.trim() && stops.length < 10) {
            setStops(p => [...p, newStop.trim()]);
            setNewStop('');
        }
    };

    const removeStop = (idx) => {
        setStops(p => p.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        // Date validation: block past dates
        if (date < today) {
            setValidationError('Cannot select a past date. Please choose today or a future date.');
            return;
        }

        // Seat limit validation
        const count = parseInt(students);
        if (isNaN(count) || count < 1) {
            setValidationError('Please enter a valid number of students.');
            return;
        }
        if (count > BUS_CAPACITY) {
            setValidationError(`Maximum ${BUS_CAPACITY} students per bus. You need ${Math.ceil(count / BUS_CAPACITY)} bus(es) for ${count} students.`);
            return;
        }

        addVisitRequest({
            facultyId: user.id,
            facultyName: user.name,
            destination,
            date,
            students: count,
            purpose,
            stops,
        });
        setDestination('');
        setDate('');
        setStudents('');
        setPurpose('');
        setStops([]);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    // Build display route for each visit
    const buildRoute = (v) => [
        'G D Goenka Education City',
        ...(v.stops || []),
        v.destination,
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Industrial Visit Requests</h1>
                <p>Request transport for industrial and educational visits</p>
            </div>

            <div className="dashboard-grid">
                {/* Request form */}
                <motion.div className="glass-panel iv-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h3>🏭 New Visit Request</h3>
                    <form onSubmit={handleSubmit} className="iv-form">
                        <div className="form-group">
                            <label className="form-label">Destination *</label>
                            <input type="text" className="form-input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Infosys Campus, Hyderabad" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Visit Date *</label>
                            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} min={today} required />
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                                Only today or future dates allowed
                            </span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Number of Students *</label>
                            <input type="number" className="form-input" value={students} onChange={(e) => setStudents(e.target.value)} placeholder="e.g. 35" min="1" max={BUS_CAPACITY} required />
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                                Max {BUS_CAPACITY} students per bus
                            </span>
                            {busesNeeded > 0 && (
                                <span style={{
                                    fontSize: 'var(--fs-xs)',
                                    color: busesNeeded > 1 ? '#fdcb6e' : '#00b894',
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600,
                                }}>
                                    🚌 {busesNeeded} bus{busesNeeded > 1 ? 'es' : ''} needed
                                </span>
                            )}
                        </div>

                        {/* Intermediate Stops */}
                        <div className="form-group">
                            <label className="form-label">Intermediate Stops (optional)</label>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', margin: '0 0 8px' }}>
                                Add stops between the college and destination (e.g. lunch break, another campus)
                            </p>
                            <div className="iv-stop-input-row">
                                <input type="text" className="form-input" value={newStop} onChange={(e) => setNewStop(e.target.value)} placeholder="e.g. Highway Dhaba, NH-48" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())} />
                                <button type="button" className="iv-add-stop-btn" onClick={addStop}>+ Add</button>
                            </div>
                            {stops.length > 0 && (
                                <div className="iv-stops-preview">
                                    <div className="iv-preview-route">
                                        <span className="iv-preview-dot start" />
                                        <span className="iv-preview-name">College</span>
                                        {stops.map((s, i) => (
                                            <span key={i} className="iv-preview-stop">
                                                <span className="iv-preview-arrow">→</span>
                                                <span className="iv-preview-dot mid" />
                                                <span className="iv-preview-name">{s}</span>
                                                <button type="button" className="iv-remove-stop" onClick={() => removeStop(i)} title="Remove stop">✕</button>
                                            </span>
                                        ))}
                                        <span className="iv-preview-arrow">→</span>
                                        <span className="iv-preview-dot end" />
                                        <span className="iv-preview-name">{destination || 'Destination'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Purpose *</label>
                            <textarea className="form-textarea" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe the purpose of the visit..." required />
                        </div>

                        <AnimatePresence>
                            {validationError && (
                                <motion.div
                                    className="iv-validation-error"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    ⚠️ {validationError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button type="submit" className="iv-submit-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            Submit Request
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {submitted && (
                            <motion.div className="iv-toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                ✅ Request submitted! The Transport Head will review it.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Visit history */}
                <motion.div className="glass-panel iv-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3>📋 My Requests ({myVisits.length})</h3>
                    {myVisits.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>No visit requests yet.</p>
                    ) : (
                        <div className="iv-list">
                            {myVisits.map((v, i) => {
                                const assignedBus = v.busAssigned ? buses.find(b => b.id === v.busAssigned) : null;
                                const routeStops = buildRoute(v);
                                return (
                                    <motion.div key={v.id} className="iv-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                        <div className="iv-card-header">
                                            <h4>{v.destination}</h4>
                                            <span className={`badge badge-${v.status === 'approved' ? 'success' : v.status === 'pending' ? 'warning' : 'danger'}`}>
                                                {v.status}
                                            </span>
                                        </div>
                                        <div className="iv-card-meta">
                                            <span>📅 {v.date || v.visit_date}</span>
                                            <span>👥 {v.students || v.num_students} students</span>
                                            <span>📝 {v.createdAt || ''}</span>
                                        </div>
                                        <p className="iv-card-purpose">{v.purpose}</p>

                                        {/* Route display: College → stops → Destination */}
                                        <div className="iv-route-card">
                                            <h5>🛣️ Route ({routeStops.length} stops)</h5>
                                            <div className="iv-route-stops-full">
                                                {routeStops.map((s, j) => (
                                                    <div key={j} className="iv-route-stop-item">
                                                        <div className={`iv-dot ${j === 0 ? 'start' : j === routeStops.length - 1 ? 'end' : 'mid'}`} />
                                                        {j < routeStops.length - 1 && <div className="iv-connector" />}
                                                        <div className="iv-stop-detail">
                                                            <span className="iv-stop-label">{j === 0 ? 'PICKUP' : j === routeStops.length - 1 ? 'DESTINATION' : `STOP ${j}`}</span>
                                                            <span className="iv-stop-name">{s}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {assignedBus && (
                                                <span className="iv-bus-tag">🚌 {assignedBus.number} – {assignedBus.name}</span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
