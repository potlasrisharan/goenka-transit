import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTransport } from '../../context/TransportContext';
import './BusTracking.css';

// Custom bus icon
function createBusIcon(color) {
    return L.divIcon({
        className: 'bus-marker',
        html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 10px ${color}80">🚌</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
}

function createStopIcon() {
    return L.divIcon({
        className: 'stop-marker',
        html: `<div style="background:#6c5ce7;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px #6c5ce780"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });
}

function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function BusTracking() {
    const { buses, routes, busPositions, drivers } = useTransport();
    const [selectedBus, setSelectedBus] = useState(null);
    const activeBuses = buses.filter(b => b.status === 'active');

    const selectedRoute = selectedBus ? routes.find(r => r.id === selectedBus.routeId) : null;
    const center = selectedBus && busPositions[selectedBus.id]
        ? [busPositions[selectedBus.id].lat, busPositions[selectedBus.id].lng]
        : [17.4435, 78.3772];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Live Bus Tracking</h1>
                <p>Real-time fleet positions and route monitoring</p>
            </div>

            <div className="tracking-layout">
                <motion.div
                    className="tracking-sidebar glass-panel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3>Active Fleet</h3>
                    <div className="bus-list">
                        {activeBuses.map(bus => {
                            const driver = drivers.find(d => d.busId === bus.id);
                            const route = routes.find(r => r.id === bus.routeId);
                            const pos = busPositions[bus.id];
                            return (
                                <motion.button
                                    key={bus.id}
                                    className={`bus-list-item ${selectedBus?.id === bus.id ? 'bus-list-item-active' : ''}`}
                                    onClick={() => setSelectedBus(bus)}
                                    whileHover={{ x: 4 }}
                                    id={`bus-${bus.id}`}
                                >
                                    <div className="bus-list-header">
                                        <span className="bus-number-tag">{bus.number}</span>
                                        <span className="bus-speed">{pos?.speed || 0} km/h</span>
                                    </div>
                                    <span className="bus-route-name">{route?.name || '—'}</span>
                                    <span className="bus-driver-name">🧑‍✈️ {driver?.name || '—'}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    className="tracking-map-area glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="map-container">
                        <MapContainer
                            center={center}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            />
                            <MapUpdater center={center} />

                            {/* Bus markers */}
                            {activeBuses.map(bus => {
                                const pos = busPositions[bus.id];
                                const route = routes.find(r => r.id === bus.routeId);
                                if (!pos) return null;
                                return (
                                    <Marker
                                        key={bus.id}
                                        position={[pos.lat, pos.lng]}
                                        icon={createBusIcon(route?.color || '#6c5ce7')}
                                    >
                                        <Popup>
                                            <strong>{bus.number} – {bus.name}</strong><br />
                                            Speed: {pos.speed} km/h
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Route polyline and stops — only when coordinates available */}
                            {selectedRoute && selectedRoute.stops?.some(s => s.lat && s.lng) && (
                                <>
                                    <Polyline
                                        positions={selectedRoute.stops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng])}
                                        color={selectedRoute.color}
                                        weight={3}
                                        opacity={0.7}
                                        dashArray="8, 8"
                                    />
                                    {selectedRoute.stops.filter(s => s.lat && s.lng).map((stop, i) => (
                                        <Marker key={i} position={[stop.lat, stop.lng]} icon={createStopIcon()}>
                                            <Popup>
                                                <strong>{stop.name}</strong><br />
                                                Time: {stop.time}
                                            </Popup>
                                        </Marker>
                                    ))}
                                </>
                            )}
                        </MapContainer>
                    </div>

                    {selectedBus && selectedRoute && (
                        <div className="route-info-bar">
                            <div className="route-info-item">
                                <span className="rib-label">Route</span>
                                <span className="rib-value">{selectedRoute.name}</span>
                            </div>
                            <div className="route-info-item">
                                <span className="rib-label">City</span>
                                <span className="rib-value">{selectedRoute.city || '—'}</span>
                            </div>
                            <div className="route-info-item">
                                <span className="rib-label">Start</span>
                                <span className="rib-value">{selectedRoute.startPoint || '—'}</span>
                            </div>
                            <div className="route-info-item">
                                <span className="rib-label">Stops</span>
                                <span className="rib-value">{selectedRoute.stops?.length || 0}</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
