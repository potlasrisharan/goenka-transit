import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';
import './SeatBooking.css';

export default function SeatBooking() {
    const { user } = useAuth();
    const { buses, routes, getSeatLayout, bookSeat, getStudentBooking } = useTransport();
    const [selectedBus, setSelectedBus] = useState(user.busId || 'BUS01');
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [booked, setBooked] = useState(false);
    const [error, setError] = useState('');

    const bus = buses.find(b => b.id === selectedBus);
    const route = routes.find(r => r.id === bus?.routeId);
    const seatLayout = getSeatLayout(selectedBus);

    // Check if this student already has a seat booked this semester
    const existingBooking = getStudentBooking(user.id);
    const existingBus = existingBooking ? buses.find(b => b.id === existingBooking.busId) : null;

    const handleBook = async () => {
        if (selectedSeat && !selectedSeat.isBooked) {
            const result = await bookSeat(selectedBus, selectedSeat.seatNumber, user.name, user.id);
            if (result?.success) {
                setBooked(true);
                setError('');
                setTimeout(() => setBooked(false), 3000);
            } else {
                setError(result?.error || 'Booking failed');
                setTimeout(() => setError(''), 4000);
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Seat Booking</h1>
                <p>Select your preferred seat on the bus</p>
            </div>

            {/* Show existing booking banner */}
            {existingBooking && (
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #00b894', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
                >
                    <span style={{ fontSize: '1.8rem' }}>✅</span>
                    <div>
                        <strong style={{ display: 'block', fontSize: '1rem', color: '#00b894' }}>Seat Already Booked This Semester</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Seat <strong>{existingBooking.seatNumber}</strong> on Bus <strong>{existingBus?.number || existingBooking.busId}</strong>
                            {existingBus ? ` (${existingBus.name})` : ''}
                        </span>
                    </div>
                    <span className="badge badge-success" style={{ marginLeft: 'auto' }}>1 of 1 Seat Used</span>
                </motion.div>
            )}

            <div className="sb-layout">
                <motion.div className="glass-panel sb-controls" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3>Select Bus</h3>
                    <div className="sb-bus-list">
                        {buses.filter(b => b.status === 'active').map(b => {
                            const r = routes.find(rt => rt.id === b.routeId);
                            return (
                                <motion.button
                                    key={b.id}
                                    className={`sb-bus-item ${selectedBus === b.id ? 'sb-bus-active' : ''}`}
                                    onClick={() => { setSelectedBus(b.id); setSelectedSeat(null); }}
                                    whileHover={{ x: 4 }}
                                >
                                    <span className="sb-bus-num">{b.number}</span>
                                    <div>
                                        <span className="sb-bus-name">{b.name}</span>
                                        <span className="sb-bus-route">{r?.name || ''}</span>
                                    </div>
                                    <span className="sb-bus-cap">{b.capacity} seats</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div className="glass-panel sb-map-area" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="sb-map-header">
                        <h3>{bus?.number} – {bus?.name}</h3>
                        {route && <span className="sb-route-tag" style={{ color: route.color }}>{route.name}</span>}
                    </div>

                    <div className="seat-map-wrapper">
                        <div className="seat-map-header">
                            <div className="seat seat-driver">🧑‍✈️</div>
                        </div>
                        <div className="seat-map">
                            {seatLayout.map((row, ri) => (
                                <div key={ri} className="seat-row">
                                    {row.map((seat, si) => (
                                        <div key={seat.id} style={{ display: 'flex', gap: si === 2 ? '24px' : '0' }}>
                                            <motion.button
                                                className={`seat ${seat.isBooked ? 'seat-booked' : 'seat-available'} ${selectedSeat?.id === seat.id ? 'seat-selected' : ''} ${existingBooking ? 'seat-locked' : ''}`}
                                                onClick={() => !seat.isBooked && !existingBooking && setSelectedSeat(seat)}
                                                whileHover={!seat.isBooked && !existingBooking ? { scale: 1.15 } : {}}
                                                whileTap={!seat.isBooked && !existingBooking ? { scale: 0.9 } : {}}
                                                disabled={seat.isBooked || !!existingBooking}
                                                title={seat.isBooked ? `Booked by ${seat.studentName}` : existingBooking ? 'You already have a seat this semester' : `Seat ${seat.seatNumber}`}
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

                    <AnimatePresence>
                        {selectedSeat && !selectedSeat.isBooked && !existingBooking && (
                            <motion.div
                                className="sb-confirm-bar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <div className="sb-confirm-info">
                                    <span>Selected Seat: <strong>{selectedSeat.seatNumber}</strong></span>
                                    <span>Bus: <strong>{bus?.number}</strong></span>
                                </div>
                                <motion.button
                                    className="sb-confirm-btn"
                                    onClick={handleBook}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Confirm Booking
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {booked && (
                            <motion.div
                                className="sb-success-toast"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                ✅ Seat booked successfully! (1 seat per semester)
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="sb-success-toast"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{ background: 'linear-gradient(135deg, #e17055, #d63031)', color: '#fff' }}
                            >
                                ❌ {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
