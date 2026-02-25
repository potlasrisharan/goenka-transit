import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import { users } from '../../data/mockData';
import './StudentManagement.css';

export default function StudentManagement() {
    const { buses, routes, getSeatLayout } = useTransport();
    const students = users.filter(u => u.role === 'student');
    const [search, setSearch] = useState('');
    const [selectedBus, setSelectedBus] = useState('BUS01');
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [highlightStudent, setHighlightStudent] = useState(null);

    const seatLayout = getSeatLayout(selectedBus);
    const bus = buses.find(b => b.id === selectedBus);
    const filtered = search
        ? students.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.id.toLowerCase().includes(search.toLowerCase())
        )
        : students;

    const handleStudentClick = (student) => {
        setHighlightStudent(student);
        if (student.busId) setSelectedBus(student.busId);
    };

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat);
        if (seat.studentId) {
            const stu = students.find(s => s.id === seat.studentId);
            if (stu) setHighlightStudent(stu);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Student & Seat Management</h1>
                <p>View assignments, search students, and manage seat allocations</p>
            </div>

            <div className="sm-layout">
                {/* Student list panel */}
                <motion.div className="glass-panel sm-student-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="sm-search">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="student-search"
                        />
                    </div>
                    <div className="sm-student-list">
                        {filtered.map(s => (
                            <button
                                key={s.id}
                                className={`sm-student-item ${highlightStudent?.id === s.id ? 'sm-student-active' : ''}`}
                                onClick={() => handleStudentClick(s)}
                            >
                                <div className="sm-stu-top">
                                    <span className="sm-stu-avatar">{s.avatar}</span>
                                    <div>
                                        <span className="sm-stu-name">{s.name}</span>
                                        <span className="sm-stu-id">{s.id}</span>
                                    </div>
                                </div>
                                <div className="sm-stu-meta">
                                    <span>Bus: {s.busId || '—'}</span>
                                    <span>Seat: {s.seatNumber || 'Unassigned'}</span>
                                    <span className={`badge ${s.feePaid ? 'badge-success' : 'badge-danger'}`}>
                                        {s.feePaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Seat map panel */}
                <motion.div className="glass-panel sm-seat-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="sm-bus-selector">
                        <h3>Seat Map</h3>
                        <select className="form-select" value={selectedBus} onChange={(e) => { setSelectedBus(e.target.value); setSelectedSeat(null); }}>
                            {buses.map(b => <option key={b.id} value={b.id}>{b.number} – {b.name}</option>)}
                        </select>
                    </div>

                    <div className="seat-map-wrapper">
                        <div className="seat-map-header">
                            <div className="seat seat-driver">🧑‍✈️</div>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Driver</span>
                        </div>
                        <div className="seat-map">
                            {seatLayout.map((row, ri) => (
                                <div key={ri} className="seat-row">
                                    {row.map((seat, si) => (
                                        <div key={seat.id}>
                                            {si === 2 && <div className="seat seat-aisle" />}
                                            <motion.button
                                                className={`seat ${seat.isBooked ? 'seat-booked' : 'seat-available'} ${selectedSeat?.id === seat.id ? 'seat-selected' : ''} ${highlightStudent?.seatNumber === seat.seatNumber && highlightStudent?.busId === selectedBus ? 'seat-selected' : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                whileHover={!seat.isBooked ? { scale: 1.15 } : {}}
                                                whileTap={!seat.isBooked ? { scale: 0.95 } : {}}
                                            >
                                                {seat.seatNumber}
                                            </motion.button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="seat-legend">
                        <span><span className="legend-dot legend-available" /> Available</span>
                        <span><span className="legend-dot legend-booked" /> Booked</span>
                        <span><span className="legend-dot legend-selected" /> Selected</span>
                    </div>

                    {selectedSeat && (
                        <motion.div className="seat-detail-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <h4>Seat {selectedSeat.seatNumber}</h4>
                            {selectedSeat.isBooked ? (
                                <div className="seat-detail-info">
                                    <p><strong>Student:</strong> {selectedSeat.studentName}</p>
                                    <p><strong>ID:</strong> {selectedSeat.studentId}</p>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>This seat is available</p>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Student detail panel */}
                {highlightStudent && (
                    <motion.div className="glass-panel sm-detail-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3>Student Details</h3>
                        <div className="sm-detail-card">
                            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: 'var(--space-md)' }}>{highlightStudent.avatar}</div>
                            <h4 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>{highlightStudent.name}</h4>
                            <div className="sm-detail-rows">
                                <DetailRow label="ID" value={highlightStudent.id} />
                                <DetailRow label="Email" value={highlightStudent.email} />
                                <DetailRow label="Phone" value={highlightStudent.phone} />
                                <DetailRow label="Bus" value={highlightStudent.busId || '—'} />
                                <DetailRow label="Seat" value={highlightStudent.seatNumber || 'Not assigned'} />
                                <DetailRow label="Route" value={routes.find(r => r.id === highlightStudent.routeId)?.name || '—'} />
                                <DetailRow label="Semester" value={highlightStudent.semester} />
                                <DetailRow label="Fee Status" value={highlightStudent.feePaid ? '✅ Paid' : '❌ Unpaid'} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            <span className="detail-value">{value}</span>
        </div>
    );
}
