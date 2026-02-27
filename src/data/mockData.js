/* ============ REAL DATA – GD GOENKA UNIVERSITY TRANSIT (JAN–JUN 2026) ============ */
/* Source: GDGU BUS ROUTES JAN-JUN 2026.xlsx */

// Users
export const users = [
    { id: 'TH001', name: 'Dr. Rajesh Kumar', email: 'transport@gdgu.org', password: 'admin123', role: 'transport_head', phone: '+91 98765 43210', avatar: '🧑‍💼' },
    { id: 'STU001', name: 'Arjun Sharma', email: 'student@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 11111', avatar: '🧑‍🎓', busId: 'BUS01', seatNumber: 'A3', routeId: 'R01', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU002', name: 'Priya Patel', email: 'priya@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 22222', avatar: '👩‍🎓', busId: 'BUS02', seatNumber: 'B2', routeId: 'R02', feePaid: false, semester: 'Spring 2026' },
    { id: 'STU003', name: 'Rahul Verma', email: 'rahul@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 33333', avatar: '🧑‍🎓', busId: 'BUS03', seatNumber: 'A1', routeId: 'R03', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU004', name: 'Sneha Gupta', email: 'sneha@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 44444', avatar: '👩‍🎓', busId: 'BUS05', seatNumber: null, routeId: 'R05', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU005', name: 'Vikram Singh', email: 'vikram@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 55555', avatar: '🧑‍🎓', busId: 'BUS07', seatNumber: 'C4', routeId: 'R07', feePaid: false, semester: 'Spring 2026' },
    { id: 'FAC001', name: 'Prof. Meera Joshi', email: 'faculty@gdgu.org', password: 'faculty123', role: 'faculty', phone: '+91 91111 11111', avatar: '👩‍🏫', busId: 'BUS02', routeId: 'R02', feePaid: true },
    { id: 'FAC002', name: 'Dr. Anand Desai', email: 'anand@gdgu.org', password: 'faculty123', role: 'faculty', phone: '+91 91111 22222', avatar: '👨‍🏫', busId: 'BUS04', routeId: 'R04', feePaid: true },
];

// Buses (11 buses from GDGU real data, all 51-seat capacity)
export const buses = [
    { id: 'BUS01', number: 'GK-01', name: 'Route 01 – Rohini West', capacity: 51, routeId: 'R01', driverId: 'DRV01', status: 'active', totalSeats: 51 },
    { id: 'BUS02', number: 'GK-02', name: 'Route 02 – Connaught Place', capacity: 51, routeId: 'R02', driverId: 'DRV02', status: 'active', totalSeats: 51 },
    { id: 'BUS03', number: 'GK-03', name: 'Route 03 – Nehru Place', capacity: 51, routeId: 'R03', driverId: 'DRV03', status: 'active', totalSeats: 51 },
    { id: 'BUS04', number: 'GK-04', name: 'Route 04 – Chatterpur', capacity: 51, routeId: 'R04', driverId: 'DRV04', status: 'active', totalSeats: 51 },
    { id: 'BUS05', number: 'GK-05', name: 'Route 05 – Janakpuri–Dwarka', capacity: 51, routeId: 'R05', driverId: 'DRV05', status: 'active', totalSeats: 51 },
    { id: 'BUS06', number: 'GK-06', name: 'Route 06 – Dwarka More', capacity: 51, routeId: 'R06', driverId: 'DRV06', status: 'active', totalSeats: 51 },
    { id: 'BUS07', number: 'GK-07', name: 'Route 07 – Najafgarh–Palam Vihar', capacity: 51, routeId: 'R07', driverId: 'DRV07', status: 'active', totalSeats: 51 },
    { id: 'BUS08', number: 'GK-08', name: 'Route 08 – Ashok Vihar Gurugram', capacity: 51, routeId: 'R08', driverId: 'DRV08', status: 'active', totalSeats: 51 },
    { id: 'BUS09', number: 'GK-09', name: 'Route 09 – HUDA City Center', capacity: 51, routeId: 'R09', driverId: 'DRV09', status: 'active', totalSeats: 51 },
    { id: 'BUS10', number: 'GK-10', name: 'Route 10 – Manesar SPR', capacity: 51, routeId: 'R10', driverId: 'DRV10', status: 'active', totalSeats: 51 },
    { id: 'BUS11', number: 'GK-11', name: 'Route 11 – Ballabhgarh–Faridabad', capacity: 51, routeId: 'R11', driverId: 'DRV11', status: 'active', totalSeats: 51 },
];

// Drivers (real names & phone numbers from GDGU data)
export const drivers = [
    { id: 'DRV01', name: 'Shashi Lal', phone: '—', license: 'HR-2025-001', busId: 'BUS01', status: 'on_duty', experience: '—', photo: '🧔', rating: 4.6, conductorName: 'Rahul Saini', conductorPhone: '—' },
    { id: 'DRV02', name: 'Rumal Singh', phone: '—', license: 'HR-2025-002', busId: 'BUS02', status: 'on_duty', experience: '—', photo: '👨', rating: 4.8, conductorName: 'SC Das Adhikari', conductorPhone: '—' },
    { id: 'DRV03', name: 'Anil Kumar Anil Sharma', phone: '+91 7303991843', license: 'HR-2025-003', busId: 'BUS03', status: 'on_duty', experience: '—', photo: '👨', rating: 4.7, conductorName: 'Vijay Morya', conductorPhone: '+91 9650863415' },
    { id: 'DRV04', name: 'Ramvakil', phone: '+91 9557591338', license: 'HR-2025-004', busId: 'BUS04', status: 'on_duty', experience: '—', photo: '🧔', rating: 4.9, conductorName: 'Virender', conductorPhone: '+91 9971971123' },
    { id: 'DRV05', name: 'Bacchu Singh', phone: '+91 9311210008', license: 'HR-2025-005', busId: 'BUS05', status: 'on_duty', experience: '—', photo: '🧑', rating: 4.5, conductorName: 'Govind', conductorPhone: '+91 9634759519' },
    { id: 'DRV06', name: 'Satbir Sharma', phone: '+91 7011563329', license: 'HR-2025-006', busId: 'BUS06', status: 'on_duty', experience: '—', photo: '👤', rating: 4.4, conductorName: 'Maan Singh', conductorPhone: '+91 7834813540' },
    { id: 'DRV07', name: 'Vinod', phone: '+91 9468032912', license: 'HR-2025-007', busId: 'BUS07', status: 'on_duty', experience: '—', photo: '👨', rating: 4.6, conductorName: 'Dinesh', conductorPhone: '+91 7988985801' },
    { id: 'DRV08', name: 'Naresh Kumar', phone: '+91 8059088438', license: 'HR-2025-008', busId: 'BUS08', status: 'on_duty', experience: '—', photo: '🧔', rating: 4.5, conductorName: 'Pravesh Kumar', conductorPhone: '+91 7988302039' },
    { id: 'DRV09', name: 'Neeraj', phone: '+91 9588146175', license: 'HR-2025-009', busId: 'BUS09', status: 'on_duty', experience: '—', photo: '👤', rating: 4.7, conductorName: 'Sriram', conductorPhone: '+91 9918663271' },
    { id: 'DRV10', name: 'Mahender', phone: '+91 7056574055', license: 'HR-2025-010', busId: 'BUS10', status: 'on_duty', experience: '—', photo: '🧑', rating: 4.3, conductorName: 'Santosh', conductorPhone: '+91 9211528110' },
    { id: 'DRV11', name: 'Baldev', phone: '+91 9458856713', license: 'HR-2025-011', busId: 'BUS11', status: 'on_duty', experience: '—', photo: '👨', rating: 4.8, conductorName: 'Premraj', conductorPhone: '+91 8607542254' },
];

// Routes – loaded from excelData.json (real GDGU bus routes)
// Import at runtime for the full stop details
import excelRoutes from './excelData.json';

export const routes = excelRoutes.map(r => ({
    id: r.id,
    name: r.name,
    startPoint: r.startPoint,
    city: r.city,
    color: r.color,
    stops: r.stops || [],
}));

// Complaints (updated to match real route locations)
export const complaints = [
    { id: 'CMP001', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Driver', subject: 'Rash driving near Punjabi Bagh', description: 'The driver was going very fast near Punjabi Bagh Chowk yesterday. Very unsafe during morning rush.', status: 'pending', date: '2026-02-20', response: null },
    { id: 'CMP002', studentId: 'STU002', studentName: 'Priya Patel', busId: 'BUS02', category: 'Seat', subject: 'Broken seat cushion', description: 'Seat B2 has a torn cushion and the spring is poking through. Needs immediate replacement.', status: 'in_progress', date: '2026-02-18', response: 'Maintenance scheduled for this weekend.' },
    { id: 'CMP003', studentId: 'STU005', studentName: 'Vikram Singh', busId: 'BUS07', category: 'Conductor', subject: 'Rude behavior by conductor', description: 'The conductor was very rude at Palam Vihar stop when I asked about the route change. Unprofessional conduct.', status: 'resolved', date: '2026-02-15', response: 'The conductor has been warned. Thank you for reporting.' },
    { id: 'CMP004', studentId: 'STU003', studentName: 'Rahul Verma', busId: 'BUS03', category: 'Other', subject: 'Bus arriving late regularly', description: 'Bus GK-03 has been arriving 15-20 minutes late at Hauz Khas Metro for the past week. This affects our first class.', status: 'pending', date: '2026-02-22', response: null },
    { id: 'CMP005', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Seat', subject: 'AC not working properly', description: 'The air conditioning on the left side of the bus is not cooling properly on the Delhi Cant stretch.', status: 'in_progress', date: '2026-02-24', response: 'Technician will inspect tomorrow.' },
];

// Seat layouts for buses (2+2 configuration with aisle, last row 3 seats)
// 12 rows × 4 seats = 48, + 1 last row × 3 seats = 51 total
export function generateSeatLayout(busId, capacity) {
    const fullRows = Math.floor(capacity / 4);
    const lastRowSeats = capacity % 4;
    const layout = [];
    const bookedSeats = getBookedSeats(busId);
    const labels = ['A', 'B', 'C', 'D'];

    for (let r = 0; r < fullRows; r++) {
        const row = [];
        for (let s = 0; s < 4; s++) {
            const seatNumber = `${labels[s]}${r + 1}`;
            const isBooked = bookedSeats[seatNumber];
            row.push({
                id: `${busId}-${seatNumber}`,
                seatNumber,
                row: r + 1,
                col: s,
                isBooked: !!isBooked,
                studentName: isBooked?.name || null,
                studentId: isBooked?.id || null,
            });
        }
        layout.push(row);
    }

    if (lastRowSeats > 0) {
        const row = [];
        const lastRowNum = fullRows + 1;
        for (let s = 0; s < lastRowSeats; s++) {
            const seatNumber = `${labels[s]}${lastRowNum}`;
            const isBooked = bookedSeats[seatNumber];
            row.push({
                id: `${busId}-${seatNumber}`,
                seatNumber,
                row: lastRowNum,
                col: s,
                isBooked: !!isBooked,
                studentName: isBooked?.name || null,
                studentId: isBooked?.id || null,
            });
        }
        layout.push(row);
    }

    return layout;
}

function getBookedSeats(busId) {
    const booked = {};
    users.filter(u => u.role === 'student' && u.busId === busId && u.seatNumber).forEach(u => {
        booked[u.seatNumber] = { name: u.name, id: u.id };
    });
    return booked;
}

// Industrial visit requests
export const industrialVisits = [
    { id: 'IV001', facultyId: 'FAC001', facultyName: 'Prof. Meera Joshi', destination: 'Infosys Campus, Gurugram', date: '2026-03-15', students: 35, purpose: 'Industry exposure visit for CS students', status: 'approved', busAssigned: 'BUS04', createdAt: '2026-02-10' },
    { id: 'IV002', facultyId: 'FAC002', facultyName: 'Dr. Anand Desai', destination: 'CSIR-NPL, New Delhi', date: '2026-03-22', students: 28, purpose: 'Physics lab visit for Science department', status: 'pending', busAssigned: null, createdAt: '2026-02-20' },
    { id: 'IV003', facultyId: 'FAC001', facultyName: 'Prof. Meera Joshi', destination: 'Maruti Suzuki Plant, Manesar', date: '2026-04-05', students: 40, purpose: 'Automobile manufacturing workshop', status: 'pending', busAssigned: null, createdAt: '2026-02-24' },
];

// Fee details
export const feeStructure = {
    semesterFee: 15000,
    lateFee: 500,
    dueDate: '2026-03-01',
    paymentMethods: ['Online Banking', 'UPI', 'Campus Counter'],
};

// Simulated bus positions (spread across NCR near real routes)
export const busPositions = {
    BUS01: { lat: 28.7041, lng: 77.1025, heading: 200, speed: 35 },   // Near Rohini, Delhi
    BUS02: { lat: 28.6328, lng: 77.2197, heading: 210, speed: 30 },   // Near Connaught Place
    BUS03: { lat: 28.5494, lng: 77.2001, heading: 190, speed: 38 },   // Near Hauz Khas
    BUS04: { lat: 28.5095, lng: 77.1735, heading: 220, speed: 32 },   // Near Chatterpur
    BUS05: { lat: 28.6219, lng: 77.0808, heading: 180, speed: 28 },   // Near Janakpuri
    BUS06: { lat: 28.5562, lng: 77.0593, heading: 190, speed: 40 },   // Near Dwarka
    BUS07: { lat: 28.6126, lng: 76.9828, heading: 160, speed: 33 },   // Near Najafgarh
    BUS08: { lat: 28.4595, lng: 77.0266, heading: 175, speed: 25 },   // Gurugram city
    BUS09: { lat: 28.4595, lng: 77.0725, heading: 185, speed: 36 },   // Near HUDA City Center
    BUS10: { lat: 28.3700, lng: 77.0500, heading: 195, speed: 42 },   // Near Manesar
    BUS11: { lat: 28.3424, lng: 77.3221, heading: 240, speed: 30 },   // Near Ballabhgarh
};
