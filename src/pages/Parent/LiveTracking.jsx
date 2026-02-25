import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { buses, routes, busPositions as initialPositions } from '../../data/mockData';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import './LiveTracking.css';

function createBusIcon() {
    return L.divIcon({
        className: 'bus-marker',
        html: `<div style="background:#6c5ce7;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 2px 12px #6c5ce780">🚌</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
}

function createStopIcon() {
    return L.divIcon({
        className: 'stop-marker',
        html: `<div style="background:#6c5ce7;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
}

export default function LiveTracking() {
    const { busId } = useParams();
    const [busPos, setBusPos] = useState(initialPositions[busId] || initialPositions['BUS01']);
    const bus = buses.find(b => b.id === busId) || buses[0];
    const route = routes.find(r => r.id === bus.routeId);

    // Simulate movement
    useEffect(() => {
        const interval = setInterval(() => {
            setBusPos(prev => ({
                ...prev,
                lat: prev.lat + (Math.random() - 0.5) * 0.002,
                lng: prev.lng + (Math.random() - 0.5) * 0.002,
                speed: Math.round(25 + Math.random() * 20),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="parent-tracking-page">
            <AnimatedBackground />
            <div className="pt-container">
                <motion.div
                    className="pt-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="pt-logo">🚌</span>
                    <div>
                        <h1 className="pt-title">Goenka Transit</h1>
                        <p className="pt-subtitle">Live Bus Tracking</p>
                    </div>
                </motion.div>

                <motion.div
                    className="pt-info-bar glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="pt-info-item">
                        <span className="pt-info-label">Bus</span>
                        <span className="pt-info-value">{bus.number} – {bus.name}</span>
                    </div>
                    <div className="pt-info-item">
                        <span className="pt-info-label">Route</span>
                        <span className="pt-info-value">{route?.name || '—'}</span>
                    </div>
                    <div className="pt-info-item">
                        <span className="pt-info-label">Speed</span>
                        <span className="pt-info-value">{busPos.speed || 0} km/h</span>
                    </div>
                    <div className="pt-info-item">
                        <span className="pt-info-label">Status</span>
                        <span className="badge badge-success">On Route</span>
                    </div>
                </motion.div>

                <motion.div
                    className="pt-map glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="map-container" style={{ height: '500px' }}>
                        <MapContainer center={[busPos.lat, busPos.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker position={[busPos.lat, busPos.lng]} icon={createBusIcon()}>
                                <Popup><strong>{bus.number}</strong><br />Speed: {busPos.speed} km/h</Popup>
                            </Marker>
                            {route && (
                                <>
                                    <Polyline positions={route.stops.map(s => [s.lat, s.lng])} color={route.color} weight={3} opacity={0.6} dashArray="6,6" />
                                    {route.stops.map((stop, i) => (
                                        <Marker key={i} position={[stop.lat, stop.lng]} icon={createStopIcon()}>
                                            <Popup>{stop.name} – {stop.time}</Popup>
                                        </Marker>
                                    ))}
                                </>
                            )}
                        </MapContainer>
                    </div>
                </motion.div>

                {route && (
                    <motion.div
                        className="pt-stops glass-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3>Route Stops</h3>
                        <div className="pt-stops-list">
                            {route.stops.map((stop, i) => (
                                <div key={i} className="pt-stop-item">
                                    <div className="pt-stop-dot" style={{ background: route.color }} />
                                    <span className="pt-stop-name">{stop.name}</span>
                                    <span className="pt-stop-time">{stop.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="pt-footer">
                    <p>Powered by <strong>Goenka Transit</strong> – Campus Transportation Management System</p>
                </div>
            </div>
        </div>
    );
}
