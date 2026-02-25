import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransport } from '../../context/TransportContext';
import './DriverDetails.css';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DriverDetails() {
    const { drivers, buses, routes, updateDriver, addDriver, reassignDriver } = useTransport();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', phone: '', conductorName: '', conductorPhone: '', license: '', experience: '', busId: '', status: 'on_duty' });
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Start editing a driver
    const startEdit = (driver) => {
        setEditingId(driver.id);
        setEditForm({
            name: driver.name, phone: driver.phone,
            conductorName: driver.conductorName, conductorPhone: driver.conductorPhone,
            license: driver.license, experience: driver.experience,
            status: driver.status, busId: driver.busId || '',
        });
    };

    const saveEdit = async () => {
        const oldDriver = drivers.find(d => d.id === editingId);
        const { busId, ...driverUpdates } = editForm;
        await updateDriver(editingId, driverUpdates);
        // Handle bus reassignment if changed
        if (busId && busId !== oldDriver.busId) {
            await reassignDriver(busId, editingId);
        }
        setEditingId(null);
        showToast('✅ Driver updated!');
    };

    const handleAdd = async () => {
        if (!addForm.name.trim()) return;
        await addDriver(addForm);
        setAddForm({ name: '', phone: '', conductorName: '', conductorPhone: '', license: '', experience: '', busId: '', status: 'on_duty' });
        setShowAddModal(false);
        showToast('✅ New driver added!');
    };

    // Buses that have no driver assigned
    const unassignedBuses = buses.filter(b => !drivers.some(d => d.busId === b.id));

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>Driver Management</h1>
                    <p>Edit details, add drivers, and assign them to buses</p>
                </div>
                <motion.button className="dd-add-btn" onClick={() => setShowAddModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    ➕ Add Driver
                </motion.button>
            </div>

            <div className="dashboard-grid">
                {drivers.map((driver, i) => {
                    const bus = buses.find(b => b.id === driver.busId);
                    const route = routes.find(r => r.id === bus?.routeId);
                    const isEditing = editingId === driver.id;

                    return (
                        <motion.div key={driver.id} className="glass-panel dd-card" variants={item} initial="hidden" animate="show" transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
                            <div className="dd-status-bar" style={{ background: driver.status === 'on_duty' ? 'var(--gradient-secondary)' : 'linear-gradient(135deg, var(--accent-warning), var(--accent-danger))' }} />

                            {isEditing ? (
                                /* ─── EDIT MODE ─── */
                                <div className="dd-edit-form">
                                    <h4>✏️ Editing {driver.name}</h4>
                                    <div className="dd-form-grid">
                                        <div className="dd-field">
                                            <label>Name</label>
                                            <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>Phone</label>
                                            <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>License</label>
                                            <input value={editForm.license} onChange={e => setEditForm(p => ({ ...p, license: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>Experience</label>
                                            <input value={editForm.experience} onChange={e => setEditForm(p => ({ ...p, experience: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>Conductor Name</label>
                                            <input value={editForm.conductorName} onChange={e => setEditForm(p => ({ ...p, conductorName: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>Conductor Phone</label>
                                            <input value={editForm.conductorPhone} onChange={e => setEditForm(p => ({ ...p, conductorPhone: e.target.value }))} />
                                        </div>
                                        <div className="dd-field">
                                            <label>Status</label>
                                            <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                                                <option value="on_duty">On Duty</option>
                                                <option value="off_duty">Off Duty</option>
                                            </select>
                                        </div>
                                        <div className="dd-field">
                                            <label>Assign to Bus</label>
                                            <select value={editForm.busId} onChange={e => setEditForm(p => ({ ...p, busId: e.target.value }))}>
                                                <option value="">— Unassigned —</option>
                                                {/* Show current bus + unassigned buses */}
                                                {bus && <option value={bus.id}>{bus.number} – {bus.name} (current)</option>}
                                                {unassignedBuses.map(b => (
                                                    <option key={b.id} value={b.id}>{b.number} – {b.name}</option>
                                                ))}
                                                {/* All other buses for reassignment */}
                                                {buses.filter(b => b.id !== driver.busId && !unassignedBuses.includes(b)).map(b => (
                                                    <option key={b.id} value={b.id}>{b.number} – {b.name} (swap)</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="dd-edit-actions">
                                        <button className="dd-save-btn" onClick={saveEdit}>💾 Save Changes</button>
                                        <button className="dd-cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                /* ─── VIEW MODE ─── */
                                <>
                                    <div className="dd-header">
                                        <div style={{ fontSize: '2.5rem' }}>{driver.photo}</div>
                                        <div>
                                            <h3>{driver.name}</h3>
                                            <span className={`badge ${driver.status === 'on_duty' ? 'badge-success' : 'badge-warning'}`}>
                                                {driver.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <button className="dd-edit-btn" onClick={() => startEdit(driver)} title="Edit driver">✏️</button>
                                    </div>
                                    <div className="dd-info">
                                        <InfoRow label="Bus" value={bus ? `${bus.number} – ${bus.name}` : '— Not assigned —'} highlight={!bus} />
                                        <InfoRow label="Route" value={route?.name || '—'} />
                                        <InfoRow label="Phone" value={driver.phone} />
                                        <InfoRow label="License" value={driver.license} />
                                        <InfoRow label="Experience" value={driver.experience} />
                                        <InfoRow label="Rating" value={`⭐ ${driver.rating}/5.0`} />
                                        <div className="dd-divider" />
                                        <InfoRow label="Conductor" value={driver.conductorName} />
                                        <InfoRow label="Conductor Ph." value={driver.conductorPhone} />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── ADD DRIVER MODAL ─── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div className="dd-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}>
                        <motion.div className="dd-modal glass-panel" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
                            <h3>➕ Add New Driver</h3>
                            <div className="dd-form-grid">
                                <div className="dd-field">
                                    <label>Name *</label>
                                    <input placeholder="Driver name" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>Phone</label>
                                    <input placeholder="+91 ..." value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>License</label>
                                    <input placeholder="DL-XXXXXXX" value={addForm.license} onChange={e => setAddForm(p => ({ ...p, license: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>Experience</label>
                                    <input placeholder="e.g. 5 years" value={addForm.experience} onChange={e => setAddForm(p => ({ ...p, experience: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>Conductor Name</label>
                                    <input placeholder="Conductor name" value={addForm.conductorName} onChange={e => setAddForm(p => ({ ...p, conductorName: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>Conductor Phone</label>
                                    <input placeholder="+91 ..." value={addForm.conductorPhone} onChange={e => setAddForm(p => ({ ...p, conductorPhone: e.target.value }))} />
                                </div>
                                <div className="dd-field">
                                    <label>Assign to Bus</label>
                                    <select value={addForm.busId} onChange={e => setAddForm(p => ({ ...p, busId: e.target.value }))}>
                                        <option value="">— Assign later —</option>
                                        {unassignedBuses.map(b => (
                                            <option key={b.id} value={b.id}>{b.number} – {b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dd-field">
                                    <label>Status</label>
                                    <select value={addForm.status} onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="on_duty">On Duty</option>
                                        <option value="off_duty">Off Duty</option>
                                    </select>
                                </div>
                            </div>
                            <div className="dd-edit-actions">
                                <button className="dd-save-btn" onClick={handleAdd}>✅ Add Driver</button>
                                <button className="dd-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div className="dd-toast" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{ color: highlight ? 'var(--accent-warning)' : 'var(--text-primary)', fontWeight: 500, fontStyle: highlight ? 'italic' : 'normal' }}>{value}</span>
        </div>
    );
}
