import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';
import { feeStructure } from '../../data/mockData';
import './StudentDashboard.css';

function createBusIcon() {
    return L.divIcon({
        className: 'bus-marker',
        html: `<div style="background:#6c5ce7;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid white;box-shadow:0 2px 8px #6c5ce780">🚌</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentDashboard() {
    const { user } = useAuth();
    const { getBusById, getRouteByBusId, getDriverByBusId, busPositions } = useTransport();

    const bus = getBusById(user.busId);
    const route = getRouteByBusId(user.busId);
    const driver = getDriverByBusId(user.busId);
    const busPos = busPositions[user.busId];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Welcome, {user.name} 👋</h1>
                <p>Your campus transport dashboard</p>
            </div>

            <motion.div className="stats-row" variants={container} initial="hidden" animate="show">
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">🚌</div>
                    <div className="stat-value">{bus?.number || '—'}</div>
                    <div className="stat-label">Assigned Bus</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">💺</div>
                    <div className="stat-value">{user.seatNumber || 'None'}</div>
                    <div className="stat-label">Seat Number</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">📍</div>
                    <div className="stat-value">{route?.stops?.length || 0}</div>
                    <div className="stat-label">Route Stops</div>
                </motion.div>
                <motion.div className="stat-card glass-panel" variants={item}>
                    <div className="stat-icon">{user.feePaid ? '✅' : '⚠️'}</div>
                    <div className="stat-value" style={{ fontSize: 'var(--fs-xl)' }}>{user.feePaid ? 'Paid' : 'Due'}</div>
                    <div className="stat-label">Fee Status</div>
                </motion.div>
            </motion.div>

            <div className="dashboard-grid" style={{ marginTop: 'var(--space-xl)' }}>
                {/* Route Info */}
                <motion.div className="glass-panel sd-section" variants={item} initial="hidden" animate="show">
                    <h3>🛣️ Route Details</h3>
                    {route ? (
                        <div className="route-details">
                            <div className="rd-name">{route.name}</div>
                            <div className="rd-meta">
                                <span>{route.totalDistance}</span>
                                <span>{route.estimatedTime}</span>
                            </div>
                            <div className="rd-stops">
                                {route.stops.map((stop, i) => (
                                    <div key={i} className="rd-stop">
                                        <div className="rd-stop-dot" style={{ background: route.color }} />
                                        <div className="rd-stop-info">
                                            <span className="rd-stop-name">{stop.name}</span>
                                            <span className="rd-stop-time">{stop.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <p style={{ color: 'var(--text-muted)' }}>No route assigned</p>}
                </motion.div>

                {/* Live Map Preview */}
                <motion.div className="glass-panel sd-section" variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
                    <h3>📡 Live Bus Location</h3>
                    {busPos ? (
                        <div className="map-container" style={{ height: '300px' }}>
                            <MapContainer center={[busPos.lat, busPos.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={[busPos.lat, busPos.lng]} icon={createBusIcon()}>
                                    <Popup>{bus?.number} – {bus?.name}<br />Speed: {busPos.speed} km/h</Popup>
                                </Marker>
                                {route && route.stops?.some(s => s.lat && s.lng) && (
                                    <Polyline positions={route.stops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng])} color={route.color} weight={3} opacity={0.6} dashArray="6, 6" />
                                )}
                            </MapContainer>
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
                            <p>Bus tracking will appear here when the bus is en route</p>
                        </div>
                    )}
                </motion.div>

                {/* Fee Info */}
                <motion.div className="glass-panel sd-section" variants={item} initial="hidden" animate="show" transition={{ delay: 0.15 }}>
                    <h3>💰 Semester Fee</h3>
                    <div className="fee-info">
                        <div className="fee-row">
                            <span>Semester Fee</span>
                            <span className="fee-amount">₹{feeStructure.semesterFee.toLocaleString()}</span>
                        </div>
                        <div className="fee-row">
                            <span>Late Fee</span>
                            <span className="fee-amount">₹{feeStructure.lateFee}</span>
                        </div>
                        <div className="fee-row">
                            <span>Due Date</span>
                            <span className="fee-amount">{feeStructure.dueDate}</span>
                        </div>
                        <div className="fee-row" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                            <span style={{ fontWeight: 700 }}>Status</span>
                            <span className={`badge ${user.feePaid ? 'badge-success' : 'badge-danger'}`}>
                                {user.feePaid ? '✅ Paid' : '❌ Payment Due'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Driver Info */}
                <motion.div className="glass-panel sd-section" variants={item} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
                    <h3>🧑‍✈️ Driver & Conductor</h3>
                    {driver ? (
                        <div className="driver-info-card">
                            <div className="dic-row"><span>Driver</span><span>{driver.name}</span></div>
                            <div className="dic-row"><span>Phone</span><span>{driver.phone}</span></div>
                            <div className="dic-row"><span>Rating</span><span>⭐ {driver.rating}</span></div>
                            <div className="dic-row" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '8px', marginTop: '4px' }}>
                                <span>Conductor</span><span>{driver.conductorName}</span>
                            </div>
                            <div className="dic-row"><span>Conductor Ph.</span><span>{driver.conductorPhone}</span></div>
                        </div>
                    ) : <p style={{ color: 'var(--text-muted)' }}>No driver info available</p>}
                </motion.div>
            </div>
        </div>
    );
}
