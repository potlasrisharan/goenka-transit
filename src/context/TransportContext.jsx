import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
    buses as mockBuses,
    drivers as mockDrivers,
    routes as mockRoutes,
    complaints as mockComplaints,
    industrialVisits as mockVisits,
    busPositions as mockPositions,
    generateSeatLayout as mockSeatLayout,
} from '../data/mockData';

const TransportContext = createContext(null);

export function TransportProvider({ children }) {
    const [buses, setBuses] = useState(mockBuses);
    const [drivers, setDrivers] = useState(mockDrivers);
    const [routes, setRoutes] = useState(mockRoutes);
    const [allComplaints, setComplaints] = useState(mockComplaints);
    const [allVisits, setVisits] = useState(mockVisits);
    const [busPositions, setBusPositions] = useState(mockPositions);
    const [students, setStudents] = useState([]);
    const [stops, setStops] = useState([]);
    const [busChangeRequests, setBusChangeRequests] = useState([]);
    const [seatBookings, setSeatBookings] = useState({});
    const [dataSource, setDataSource] = useState('mock');
    const intervalRef = useRef(null);

    // ── Supabase Data Fetching ──
    useEffect(() => {
        if (!isSupabaseConfigured()) return;
        async function fetchAll() {
            try {
                const rRes = await supabase.from('routes').select('*').catch(e => ({ error: e }));
                const bRes = await supabase.from('buses').select('*').catch(e => ({ error: e }));
                const dRes = await supabase.from('drivers').select('*').catch(e => ({ error: e }));
                const sRes = await supabase.from('students').select('*').catch(e => ({ error: e }));
                const cRes = await supabase.from('complaints').select('*').order('created_at', { ascending: false }).catch(e => ({ error: e }));
                const stRes = await supabase.from('seats').select('*').catch(e => ({ error: e }));
                const stopsRes = await supabase.from('stops').select('*').order('stop_order', { ascending: true }).catch(e => ({ error: e }));
                const bcrRes = await supabase.from('bus_change_requests').select('*').order('created_at', { ascending: false }).catch(e => ({ error: e }));
                const ivRes = await supabase.from('industrial_visits').select('*').order('created_at', { ascending: false }).catch(e => ({ error: e }));
                let used = false;
                if (!rRes.error && rRes.data.length > 0) {
                    // Attach stops to routes
                    const stopsData = (!stopsRes.error && stopsRes.data) || [];
                    const mapped = rRes.data.map(r => ({
                        id: r.id, name: r.name, startPoint: r.start_point, city: r.city, color: r.color || '#6c5ce7',
                        stops: stopsData.filter(s => s.route_id === r.id).sort((a, b) => a.stop_order - b.stop_order).map(s => ({
                            name: s.name, time: s.pickup_time, order: s.stop_order,
                        })),
                    }));
                    setRoutes(mapped);
                    setStops(stopsData);
                    used = true;
                }
                if (!bRes.error && bRes.data.length > 0) {
                    const fetchedBuses = bRes.data.map(b => ({
                        id: b.id, number: b.number || b.id, name: b.name || b.id,
                        capacity: b.total_seats || b.capacity || 51, routeId: b.route_id, driverId: b.driver_id,
                        status: b.status || 'active', totalSeats: b.total_seats || 51,
                    }));
                    setBuses(fetchedBuses);

                    // Initialize realistic bus positions near GD Goenka Education City (Gurugram/Sohna)
                    // GDGU Approx: Lat 28.257, Lng 77.050
                    const initialPositions = {};
                    fetchedBuses.forEach((b, i) => {
                        const offsetLat = (Math.random() - 0.5) * 0.15; // Spread them out around Delhi/NCR
                        const offsetLng = (Math.random() - 0.5) * 0.15;
                        initialPositions[b.id] = {
                            lat: 28.257 + offsetLat,
                            lng: 77.050 + offsetLng,
                            heading: Math.floor(Math.random() * 360),
                            speed: b.status === 'active' ? 20 + Math.floor(Math.random() * 30) : 0
                        };
                    });
                    setBusPositions(initialPositions);

                    used = true;
                }
                if (!dRes.error && dRes.data.length > 0) {
                    setDrivers(dRes.data.map(d => ({
                        id: d.id, name: d.name, phone: d.phone || '—', busId: d.bus_id,
                        status: d.status || 'on_duty', rating: d.rating || 4.5,
                        conductorName: d.conductor_name || '—', conductorPhone: d.conductor_phone || '—',
                        license: d.license || '—', experience: d.experience || '—', photo: '🧑',
                    })));
                    used = true;
                }
                if (!sRes.error && sRes.data.length > 0) {
                    setStudents(sRes.data.map(s => ({
                        id: s.id, name: s.name, email: s.email || '—', phone: s.phone || '—',
                        routeId: s.route_id, busId: s.bus_id, seatNumber: s.seat_number,
                        feePaid: s.fee_paid ?? false, role: 'student', avatar: '🧑‍🎓',
                    })));
                    used = true;
                }
                if (!cRes.error && cRes.data.length > 0) {
                    setComplaints(cRes.data.map(c => ({
                        id: c.id, studentId: c.student_id, studentName: c.student_name || '—',
                        busId: c.bus_id, category: c.category || 'Other',
                        subject: c.subject || c.message?.substring(0, 50) || '—',
                        description: c.message || '—', status: c.status || 'pending',
                        date: c.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                        response: c.response,
                    })));
                    used = true;
                }
                if (!stRes.error && stRes.data.length > 0) {
                    const bookingMap = {};
                    stRes.data.forEach(s => {
                        if (s.student_id) {
                            if (!bookingMap[s.bus_id]) bookingMap[s.bus_id] = {};
                            bookingMap[s.bus_id][s.seat_number] = { name: s.student_id, id: s.student_id };
                        }
                    });
                    setSeatBookings(bookingMap);
                }
                if (!bcrRes.error) {
                    setBusChangeRequests((bcrRes.data || []).map(r => ({
                        ...r,
                        studentId: r.student_id || r.studentId,
                        studentName: r.student_name || r.studentName,
                        busId: r.current_bus_id || r.busId,
                        requestedBusId: r.requested_bus_id || r.requestedBusId,
                        reason: r.reason,
                        status: r.status || 'pending',
                        date: r.created_at?.split('T')[0] || r.date,
                    })));
                    used = true;
                }
                if (!ivRes.error) {
                    setVisits((ivRes.data || []).map(v => ({
                        id: v.id, facultyId: v.faculty_id, facultyName: v.faculty_name,
                        destination: v.destination, date: v.visit_date, students: v.num_students,
                        purpose: v.purpose, status: v.status, busAssigned: v.bus_assigned,
                        createdAt: v.created_at?.split('T')[0],
                        stops: v.purpose?.includes('[STOPS]') ? JSON.parse(v.purpose.split('[STOPS]')[1] || '[]') : [],
                    })));
                    used = true;
                }
                if (used) { setDataSource('supabase'); console.log('[TransportContext] ✅ Using Supabase data'); }
            } catch (err) { console.error('[TransportContext] Fetch error:', err); }
        }
        fetchAll();

        if (!isSupabaseConfigured()) return;

        // ── Realtime Subscriptions ──
        const channel = supabase.channel('transport-data-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, (payload) => {
                console.log('Realtime Update [complaints]:', payload);
                if (payload.eventType === 'INSERT') {
                    setComplaints(p => [{
                        id: payload.new.id, studentId: payload.new.student_id, studentName: payload.new.student_name || '—',
                        busId: payload.new.bus_id, category: payload.new.category || 'Other',
                        subject: payload.new.subject || payload.new.message?.substring(0, 50) || '—',
                        description: payload.new.message || '—', status: payload.new.status || 'pending',
                        date: payload.new.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                        response: payload.new.response,
                    }, ...p]);
                } else if (payload.eventType === 'UPDATE') {
                    setComplaints(p => p.map(c => c.id === payload.new.id ? { ...c, status: payload.new.status, response: payload.new.response } : c));
                } else if (payload.eventType === 'DELETE') {
                    setComplaints(p => p.filter(c => c.id !== payload.old.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'industrial_visits' }, (payload) => {
                console.log('Realtime Update [industrial_visits]:', payload);
                if (payload.eventType === 'INSERT') {
                    setVisits(p => [{
                        id: payload.new.id, facultyId: payload.new.faculty_id, facultyName: payload.new.faculty_name,
                        destination: payload.new.destination, date: payload.new.visit_date, students: payload.new.num_students,
                        purpose: payload.new.purpose, status: payload.new.status, busAssigned: payload.new.bus_assigned,
                        createdAt: payload.new.created_at?.split('T')[0],
                        stops: payload.new.purpose?.includes('[STOPS]') ? JSON.parse(payload.new.purpose.split('[STOPS]')[1] || '[]') : [],
                    }, ...p]);
                } else if (payload.eventType === 'UPDATE') {
                    setVisits(p => p.map(v => v.id === payload.new.id ? { ...v, status: payload.new.status, busAssigned: payload.new.bus_assigned } : v));
                } else if (payload.eventType === 'DELETE') {
                    setVisits(p => p.filter(v => v.id !== payload.old.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bus_change_requests' }, (payload) => {
                console.log('Realtime Update [bus_change_requests]:', payload);
                if (payload.eventType === 'INSERT') {
                    setBusChangeRequests(p => [payload.new, ...p]);
                } else if (payload.eventType === 'UPDATE') {
                    setBusChangeRequests(p => p.map(r => r.id === payload.new.id ? payload.new : r));
                } else if (payload.eventType === 'DELETE') {
                    setBusChangeRequests(p => p.filter(r => r.id !== payload.old.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, (payload) => {
                console.log('Realtime Update [drivers]:', payload);
                if (payload.eventType === 'INSERT') {
                    setDrivers(p => [...p, {
                        id: payload.new.id, name: payload.new.name, phone: payload.new.phone || '—', busId: payload.new.bus_id,
                        status: payload.new.status || 'on_duty', rating: payload.new.rating || 4.5,
                        conductorName: payload.new.conductor_name || '—', conductorPhone: payload.new.conductor_phone || '—',
                        license: payload.new.license || '—', experience: payload.new.experience || '—', photo: '🧑',
                    }]);
                } else if (payload.eventType === 'UPDATE') {
                    setDrivers(p => p.map(d => d.id === payload.new.id ? { ...d, ...payload.new, busId: payload.new.bus_id, conductorName: payload.new.conductor_name, conductorPhone: payload.new.conductor_phone } : d));
                } else if (payload.eventType === 'DELETE') {
                    setDrivers(p => p.filter(d => d.id !== payload.old.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, (payload) => {
                console.log('Realtime Update [seats]:', payload);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    setSeatBookings(p => ({
                        ...p,
                        [payload.new.bus_id]: {
                            ...(p[payload.new.bus_id] || {}),
                            [payload.new.seat_number]: { name: payload.new.student_id, id: payload.new.student_id }
                        }
                    }));
                } else if (payload.eventType === 'DELETE') {
                    setSeatBookings(p => {
                        const newBk = { ...p };
                        if (newBk[payload.old.bus_id]) {
                            delete newBk[payload.old.bus_id][payload.old.seat_number];
                        }
                        return newBk;
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // ── Bus movement simulation ──
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setBusPositions(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(busId => {
                    if (next[busId].speed > 0) {
                        const j = () => (Math.random() - 0.5) * 0.002;
                        next[busId] = { ...next[busId], lat: next[busId].lat + j(), lng: next[busId].lng + j() };
                    }
                });
                return next;
            });
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // ── Lookups ──
    const getBusById = useCallback((id) => buses.find(b => b.id === id), [buses]);
    const getDriverByBusId = useCallback((busId) => drivers.find(d => d.busId === busId), [drivers]);
    const getRouteById = useCallback((id) => routes.find(r => r.id === id), [routes]);
    const getRouteByBusId = useCallback((busId) => {
        const bus = buses.find(b => b.id === busId);
        return bus ? routes.find(r => r.id === bus.routeId) : null;
    }, [buses, routes]);

    // ── Seat Layout ──
    const getSeatLayout = useCallback((busId) => {
        const bus = buses.find(b => b.id === busId);
        if (!bus) return [];
        const layout = mockSeatLayout(busId, bus.totalSeats || bus.capacity || 51);
        const bk = seatBookings[busId] || {};
        return layout.map(row => row.map(seat => ({
            ...seat, isBooked: seat.isBooked || !!bk[seat.seatNumber],
            studentName: seat.studentName || bk[seat.seatNumber]?.name || null,
        })));
    }, [buses, seatBookings]);

    // ── Mutations ──
    // Check if a student already has a booked seat anywhere (one seat per semester)
    const getStudentBooking = useCallback((studentId) => {
        for (const busId of Object.keys(seatBookings)) {
            for (const seatNum of Object.keys(seatBookings[busId])) {
                if (seatBookings[busId][seatNum]?.id === studentId) {
                    return { busId, seatNumber: seatNum };
                }
            }
        }
        return null;
    }, [seatBookings]);

    const bookSeat = useCallback(async (busId, seatNumber, studentName, studentId) => {
        // Enforce one seat per semester
        const existing = getStudentBooking(studentId);
        if (existing) {
            return { success: false, error: `You already have Seat ${existing.seatNumber} on Bus ${existing.busId}. One seat per semester.` };
        }
        setSeatBookings(p => ({ ...p, [busId]: { ...(p[busId] || {}), [seatNumber]: { name: studentName, id: studentId } } }));
        if (isSupabaseConfigured()) {
            await supabase.from('seats').upsert({ bus_id: busId, seat_number: seatNumber, student_id: studentId, is_booked: true }, { onConflict: 'bus_id,seat_number' });
        }
        return { success: true };
    }, [getStudentBooking]);

    const addComplaint = useCallback(async (c) => {
        const newC = { ...c, id: `CMP${Date.now()}`, status: 'pending', date: new Date().toISOString().split('T')[0], response: null };
        setComplaints(p => [newC, ...p]);
        if (isSupabaseConfigured()) {
            await supabase.from('complaints').insert({ student_id: c.studentId, student_name: c.studentName, bus_id: c.busId, category: c.category, subject: c.subject, message: c.description, status: 'pending' });
        }
    }, []);

    const updateComplaintStatus = useCallback(async (id, status, response) => {
        setComplaints(p => p.map(c => c.id === id ? { ...c, status, response: response || c.response } : c));
        if (isSupabaseConfigured()) {
            const updates = { status };
            if (response) updates.response = response;
            await supabase.from('complaints').update(updates).eq('id', id);
        }
    }, []);

    // ── Bus Change Requests ──
    const submitBusChangeRequest = useCallback(async (req) => {
        const tempId = `BCR_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const newReq = { ...req, id: tempId, status: 'pending', created_at: new Date().toISOString() };
        setBusChangeRequests(p => [newReq, ...p]);
        if (isSupabaseConfigured()) {
            const { data } = await supabase.from('bus_change_requests').insert({
                student_id: req.student_id, student_name: req.student_name,
                current_bus_id: req.current_bus_id, requested_bus_id: req.requested_bus_id, reason: req.reason,
            }).select();
            if (data?.[0]) {
                // Replace temp ID with real Supabase ID
                setBusChangeRequests(p => p.map(r => r.id === tempId ? { ...data[0] } : r));
            }
        }
    }, []);

    const approveBusChange = useCallback(async (id, approved, note) => {
        const targetReq = busChangeRequests.find(r => r.id === id);
        if (!targetReq) return;

        const status = approved ? 'approved' : 'rejected';

        if (approved) {
            // Approve this one, auto-reject all other PENDING requests from the same student
            const studentId = targetReq.student_id || targetReq.studentId;
            setBusChangeRequests(p => p.map(r => {
                if (r.id === id) return { ...r, status: 'approved', admin_note: note };
                if ((r.student_id || r.studentId) === studentId && r.status === 'pending') {
                    return { ...r, status: 'rejected', admin_note: 'Auto-rejected: another request was approved' };
                }
                return r;
            }));

            if (isSupabaseConfigured()) {
                // Update the approved request
                await supabase.from('bus_change_requests').update({ status: 'approved', admin_note: note, updated_at: new Date().toISOString() }).eq('id', id);
                // Auto-reject other pending requests from same student
                await supabase.from('bus_change_requests')
                    .update({ status: 'rejected', admin_note: 'Auto-rejected: another request was approved', updated_at: new Date().toISOString() })
                    .eq('student_id', studentId)
                    .eq('status', 'pending')
                    .neq('id', id);
                // Update student's bus assignment
                await supabase.from('students').update({ bus_id: targetReq.requested_bus_id }).eq('id', studentId);
            }
        } else {
            // Just reject this one request
            setBusChangeRequests(p => p.map(r => r.id === id ? { ...r, status: 'rejected', admin_note: note } : r));
            if (isSupabaseConfigured()) {
                await supabase.from('bus_change_requests').update({ status: 'rejected', admin_note: note, updated_at: new Date().toISOString() }).eq('id', id);
            }
        }
    }, [busChangeRequests]);

    // ── Industrial Visits ──
    const addVisitRequest = useCallback(async (v) => {
        const newV = { ...v, id: `IV${Date.now()}`, status: 'pending', busAssigned: null, createdAt: new Date().toISOString().split('T')[0], stops: v.stops || [] };
        setVisits(p => [newV, ...p]);
        if (isSupabaseConfigured()) {
            await supabase.from('industrial_visits').insert({
                faculty_id: v.facultyId, faculty_name: v.facultyName, destination: v.destination,
                visit_date: v.date, num_students: v.students,
                purpose: v.purpose + (v.stops?.length ? `\n[STOPS]${JSON.stringify(v.stops)}` : ''),
            });
        }
    }, []);

    const approveVisitRequest = useCallback(async (id, busId, note) => {
        setVisits(p => p.map(v => v.id === id ? { ...v, status: 'approved', busAssigned: busId } : v));
        if (isSupabaseConfigured()) {
            await supabase.from('industrial_visits').update({ status: 'approved', bus_assigned: busId, admin_note: note }).eq('id', id);
        }
    }, []);

    const updateVisitStatus = useCallback(async (id, status, busAssigned) => {
        setVisits(p => p.map(v => v.id === id ? { ...v, status, busAssigned: busAssigned || v.busAssigned } : v));
        if (isSupabaseConfigured()) {
            await supabase.from('industrial_visits').update({ status, bus_assigned: busAssigned }).eq('id', id);
        }
    }, []);

    // ── Route management (Transport Head) ──
    const reassignDriver = useCallback(async (busId, driverId) => {
        // Un-assign any driver currently on this bus
        setDrivers(p => p.map(d => d.busId === busId ? { ...d, busId: null } : d));
        setBuses(p => p.map(b => b.id === busId ? { ...b, driverId } : b));
        setDrivers(p => p.map(d => d.id === driverId ? { ...d, busId } : d));
        if (isSupabaseConfigured()) {
            await Promise.all([
                supabase.from('buses').update({ driver_id: driverId }).eq('id', busId),
                supabase.from('drivers').update({ bus_id: busId }).eq('id', driverId),
            ]);
        }
    }, []);

    const updateDriver = useCallback(async (driverId, updates) => {
        setDrivers(p => p.map(d => d.id === driverId ? { ...d, ...updates } : d));
        if (isSupabaseConfigured()) {
            const dbUpdates = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
            if (updates.conductorName !== undefined) dbUpdates.conductor_name = updates.conductorName;
            if (updates.conductorPhone !== undefined) dbUpdates.conductor_phone = updates.conductorPhone;
            if (updates.status !== undefined) dbUpdates.status = updates.status;
            if (updates.license !== undefined) dbUpdates.license = updates.license;
            if (updates.experience !== undefined) dbUpdates.experience = updates.experience;
            if (Object.keys(dbUpdates).length > 0) {
                await supabase.from('drivers').update(dbUpdates).eq('id', driverId);
            }
        }
    }, []);

    const addDriver = useCallback(async (driverData) => {
        const newId = `DRV${Date.now()}`;
        const newDriver = {
            id: newId, name: driverData.name, phone: driverData.phone || '—',
            busId: driverData.busId || null, status: driverData.status || 'on_duty',
            rating: 4.5, conductorName: driverData.conductorName || '—',
            conductorPhone: driverData.conductorPhone || '—',
            license: driverData.license || '—', experience: driverData.experience || '—', photo: '🧑',
        };
        setDrivers(p => [...p, newDriver]);
        if (newDriver.busId) {
            setBuses(p => p.map(b => b.id === newDriver.busId ? { ...b, driverId: newId } : b));
        }
        if (isSupabaseConfigured()) {
            await supabase.from('drivers').insert({
                id: newId, name: newDriver.name, phone: newDriver.phone, bus_id: newDriver.busId,
                status: newDriver.status, conductor_name: newDriver.conductorName,
                conductor_phone: newDriver.conductorPhone, license: newDriver.license, experience: newDriver.experience,
            });
            if (newDriver.busId) {
                await supabase.from('buses').update({ driver_id: newId }).eq('id', newDriver.busId);
            }
        }
        return newDriver;
    }, []);

    const value = {
        buses, drivers, routes, busPositions, students, stops, dataSource, seatBookings,
        complaints: allComplaints, industrialVisits: allVisits, busChangeRequests,
        getBusById, getDriverByBusId, getRouteById, getRouteByBusId,
        getSeatLayout, bookSeat, getStudentBooking,
        addComplaint, updateComplaintStatus,
        submitBusChangeRequest, approveBusChange,
        addVisitRequest, approveVisitRequest, updateVisitStatus,
        reassignDriver, updateDriver, addDriver,
    };

    return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}

export function useTransport() {
    const ctx = useContext(TransportContext);
    if (!ctx) throw new Error('useTransport must be used within TransportProvider');
    return ctx;
}
