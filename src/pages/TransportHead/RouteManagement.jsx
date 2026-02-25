import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import './RouteManagement.css';

export default function RouteManagement() {
    const { routes, buses, drivers, reassignDriver } = useTransport();
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [editDriver, setEditDriver] = useState(null);

    const getRouteBus = (routeId) => buses.find(b => b.routeId === routeId);
    const getRouteDriver = (routeId) => {
        const bus = getRouteBus(routeId);
        return bus ? drivers.find(d => d.busId === bus.id) : null;
    };

    const handleReassign = async (busId, newDriverId) => {
        await reassignDriver(busId, newDriverId);
        setEditDriver(null);
    };

    return (
        <motion.div className="route-mgmt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <h1>🗺️ Route Management</h1>
                <p>View and manage all {routes.length} bus routes, stops, and driver assignments</p>
            </div>

            <div className="routes-grid">
                {routes.map((route, i) => {
                    const bus = getRouteBus(route.id);
                    const driver = getRouteDriver(route.id);
                    const isSelected = selectedRoute?.id === route.id;

                    return (
                        <motion.div
                            key={route.id}
                            className={`route-card ${isSelected ? 'expanded' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedRoute(isSelected ? null : route)}
                            style={{ borderColor: route.color }}
                        >
                            <div className="route-card-header">
                                <div className="route-badge" style={{ background: route.color }}>{route.id}</div>
                                <div className="route-info">
                                    <h3>{route.name}</h3>
                                    <span className="route-city">{route.city || 'New Delhi'}</span>
                                </div>
                                <div className="route-meta">
                                    <span className="stop-count">{route.stops?.length || 0} stops</span>
                                    {bus && <span className={`bus-status ${bus.status}`}>{bus.number}</span>}
                                </div>
                            </div>

                            {driver && (
                                <div className="route-driver">
                                    <span>🧑 {driver.name}</span>
                                    <span className="driver-phone">{driver.phone}</span>
                                    {driver.conductorName !== '—' && (
                                        <span className="conductor">👤 {driver.conductorName}</span>
                                    )}
                                </div>
                            )}

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        className="route-detail"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="stops-timeline">
                                            <h4>📍 Route Stops</h4>
                                            {route.stops?.map((stop, si) => (
                                                <div key={si} className="stop-item">
                                                    <div className="stop-dot" style={{ borderColor: route.color }} />
                                                    <div className="stop-content">
                                                        <span className="stop-name">{stop.name}</span>
                                                        <span className="stop-time">{stop.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {bus && (
                                            <div className="route-actions">
                                                <h4>⚙️ Bus Assignment</h4>
                                                <div className="assignment-info">
                                                    <span>Bus: <strong>{bus.number} – {bus.name}</strong></span>
                                                    <span>Capacity: <strong>{bus.capacity} seats</strong></span>
                                                    <span>Status: <strong className={bus.status}>{bus.status}</strong></span>
                                                </div>

                                                {editDriver === bus.id ? (
                                                    <div className="driver-select">
                                                        <select
                                                            defaultValue={bus.driverId}
                                                            onChange={(e) => handleReassign(bus.id, e.target.value)}
                                                        >
                                                            {drivers.map(d => (
                                                                <option key={d.id} value={d.id}>
                                                                    {d.name} ({d.phone})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button className="btn-cancel" onClick={() => setEditDriver(null)}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button className="btn-reassign" onClick={() => setEditDriver(bus.id)}>
                                                        🔄 Reassign Driver
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
