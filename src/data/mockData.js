/* ============ MOCK DATA FOR GD GOENKA TRANSIT ============ */
/* GD Goenka University – Sohna Road, Gurugram, Haryana */

// Users
export const users = [
    { id: 'TH001', name: 'Dr. Rajesh Kumar', email: 'transport@gdgu.org', password: 'admin123', role: 'transport_head', phone: '+91 98765 43210', avatar: '🧑‍💼' },
    { id: 'STU001', name: 'Arjun Sharma', email: 'student@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 11111', avatar: '🧑‍🎓', busId: 'BUS01', seatNumber: 'A3', routeId: 'R1', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU002', name: 'Priya Patel', email: 'priya@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 22222', avatar: '👩‍🎓', busId: 'BUS01', seatNumber: 'B2', routeId: 'R1', feePaid: false, semester: 'Spring 2026' },
    { id: 'STU003', name: 'Rahul Verma', email: 'rahul@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 33333', avatar: '🧑‍🎓', busId: 'BUS02', seatNumber: 'A1', routeId: 'R2', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU004', name: 'Sneha Gupta', email: 'sneha@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 44444', avatar: '👩‍🎓', busId: 'BUS02', seatNumber: null, routeId: 'R2', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU005', name: 'Vikram Singh', email: 'vikram@gdgu.org', password: 'student123', role: 'student', phone: '+91 90000 55555', avatar: '🧑‍🎓', busId: 'BUS03', seatNumber: 'C4', routeId: 'R3', feePaid: false, semester: 'Spring 2026' },
    { id: 'FAC001', name: 'Prof. Meera Joshi', email: 'faculty@gdgu.org', password: 'faculty123', role: 'faculty', phone: '+91 91111 11111', avatar: '👩‍🏫', busId: 'BUS01', routeId: 'R1', feePaid: true },
    { id: 'FAC002', name: 'Dr. Anand Desai', email: 'anand@gdgu.org', password: 'faculty123', role: 'faculty', phone: '+91 91111 22222', avatar: '👨‍🏫', busId: 'BUS03', routeId: 'R3', feePaid: true },
];

// Buses
export const buses = [
    { id: 'BUS01', number: 'GK-01', name: 'Goenka Express', capacity: 51, routeId: 'R1', driverId: 'DRV01', status: 'active', totalSeats: 51 },
    { id: 'BUS02', number: 'GK-02', name: 'Campus Cruiser', capacity: 51, routeId: 'R2', driverId: 'DRV02', status: 'active', totalSeats: 51 },
    { id: 'BUS03', number: 'GK-03', name: 'Scholar Shuttle', capacity: 51, routeId: 'R3', driverId: 'DRV03', status: 'active', totalSeats: 51 },
    { id: 'BUS04', number: 'GK-04', name: 'Knowledge Kart', capacity: 51, routeId: 'R4', driverId: 'DRV04', status: 'maintenance', totalSeats: 51 },
    { id: 'BUS05', number: 'GK-05', name: 'Quick Connect', capacity: 51, routeId: 'R5', driverId: 'DRV05', status: 'active', totalSeats: 51 },
];

// Drivers
export const drivers = [
    { id: 'DRV01', name: 'Ramesh Yadav', phone: '+91 80000 11111', license: 'HR-2024-001234', busId: 'BUS01', status: 'on_duty', experience: '8 yrs', photo: '🧔', rating: 4.6, conductorName: 'Suresh Kumar', conductorPhone: '+91 80000 11112' },
    { id: 'DRV02', name: 'Vijay Singh', phone: '+91 80000 22222', license: 'HR-2024-005678', busId: 'BUS02', status: 'on_duty', experience: '5 yrs', photo: '👨', rating: 4.8, conductorName: 'Manoj Tiwari', conductorPhone: '+91 80000 22223' },
    { id: 'DRV03', name: 'Kiran Pal', phone: '+91 80000 33333', license: 'HR-2024-009101', busId: 'BUS03', status: 'on_duty', experience: '12 yrs', photo: '👴', rating: 4.9, conductorName: 'Ashok Meena', conductorPhone: '+91 80000 33334' },
    { id: 'DRV04', name: 'Deepak Sharma', phone: '+91 80000 44444', license: 'HR-2024-001122', busId: 'BUS04', status: 'off_duty', experience: '3 yrs', photo: '🧑', rating: 4.3, conductorName: 'Ravi Das', conductorPhone: '+91 80000 44445' },
    { id: 'DRV05', name: 'Sanjay Mishra', phone: '+91 80000 55555', license: 'HR-2024-003344', busId: 'BUS05', status: 'on_duty', experience: '7 yrs', photo: '👤', rating: 4.5, conductorName: 'Amit Chauhan', conductorPhone: '+91 80000 55556' },
];

// Routes (GD Goenka University, Sohna Road, Gurugram → Delhi/NCR)
// GDGU Campus approx: Lat 28.257, Lng 77.050
export const routes = [
    {
        id: 'R1', name: 'Route A – Gurugram City',
        stops: [
            { name: 'GDGU Campus Gate', lat: 28.2570, lng: 77.0500, time: '7:00 AM' },
            { name: 'Sohna Chowk', lat: 28.2470, lng: 77.0650, time: '7:10 AM' },
            { name: 'Subhash Chowk', lat: 28.4190, lng: 77.0420, time: '7:30 AM' },
            { name: 'Sector 56 Huda Market', lat: 28.4260, lng: 77.0680, time: '7:40 AM' },
            { name: 'IFFCO Chowk', lat: 28.4729, lng: 77.0725, time: '7:55 AM' },
            { name: 'GDGU Campus Main', lat: 28.2570, lng: 77.0500, time: '9:00 AM' },
        ],
        totalDistance: '52 km',
        estimatedTime: '2 hr',
        color: '#6c5ce7',
    },
    {
        id: 'R2', name: 'Route B – Delhi South',
        stops: [
            { name: 'GDGU Campus Gate', lat: 28.2570, lng: 77.0500, time: '6:45 AM' },
            { name: 'Sohna Road Toll', lat: 28.3590, lng: 77.0370, time: '7:00 AM' },
            { name: 'Mehrauli', lat: 28.5253, lng: 77.1851, time: '7:30 AM' },
            { name: 'Saket Metro', lat: 28.5215, lng: 77.2029, time: '7:40 AM' },
            { name: 'Hauz Khas', lat: 28.5494, lng: 77.2001, time: '7:50 AM' },
            { name: 'GDGU Campus Main', lat: 28.2570, lng: 77.0500, time: '9:15 AM' },
        ],
        totalDistance: '65 km',
        estimatedTime: '2 hr 30 min',
        color: '#00cec9',
    },
    {
        id: 'R3', name: 'Route C – Faridabad Link',
        stops: [
            { name: 'GDGU Campus Gate', lat: 28.2570, lng: 77.0500, time: '6:50 AM' },
            { name: 'Ballabgarh', lat: 28.3424, lng: 77.3221, time: '7:15 AM' },
            { name: 'Sector 15 Faridabad', lat: 28.3889, lng: 77.3148, time: '7:30 AM' },
            { name: 'NIT Faridabad', lat: 28.3670, lng: 77.3200, time: '7:40 AM' },
            { name: 'Badarpur Border', lat: 28.5090, lng: 77.3040, time: '7:55 AM' },
            { name: 'GDGU Campus Main', lat: 28.2570, lng: 77.0500, time: '9:15 AM' },
        ],
        totalDistance: '58 km',
        estimatedTime: '2 hr 25 min',
        color: '#fd79a8',
    },
    {
        id: 'R4', name: 'Route D – Delhi Central',
        stops: [
            { name: 'GDGU Campus Gate', lat: 28.2570, lng: 77.0500, time: '6:30 AM' },
            { name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, time: '7:30 AM' },
            { name: 'Karol Bagh', lat: 28.6514, lng: 77.1907, time: '7:45 AM' },
            { name: 'Dwarka Sector 21', lat: 28.5562, lng: 77.0593, time: '8:05 AM' },
            { name: 'GDGU Campus Main', lat: 28.2570, lng: 77.0500, time: '9:30 AM' },
        ],
        totalDistance: '80 km',
        estimatedTime: '3 hr',
        color: '#fdcb6e',
    },
    {
        id: 'R5', name: 'Route E – Sohna–Palwal Shuttle',
        stops: [
            { name: 'GDGU Campus Gate', lat: 28.2570, lng: 77.0500, time: '7:00 AM' },
            { name: 'Sohna Bus Stand', lat: 28.2430, lng: 77.0680, time: '7:10 AM' },
            { name: 'Tauru', lat: 28.1880, lng: 76.9520, time: '7:30 AM' },
            { name: 'Palwal', lat: 28.1445, lng: 77.3286, time: '7:55 AM' },
            { name: 'GDGU Campus Main', lat: 28.2570, lng: 77.0500, time: '8:45 AM' },
        ],
        totalDistance: '45 km',
        estimatedTime: '1 hr 45 min',
        color: '#e17055',
    },
];

// Complaints
export const complaints = [
    { id: 'CMP001', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Driver', subject: 'Rash driving near Subhash Chowk', description: 'The driver was going very fast near Subhash Chowk junction yesterday. It felt unsafe.', status: 'pending', date: '2026-02-20', response: null },
    { id: 'CMP002', studentId: 'STU002', studentName: 'Priya Patel', busId: 'BUS01', category: 'Seat', subject: 'Broken seat cushion', description: 'Seat B2 has a torn cushion and the spring is poking through. Needs immediate replacement.', status: 'in_progress', date: '2026-02-18', response: 'Maintenance scheduled for this weekend.' },
    { id: 'CMP003', studentId: 'STU005', studentName: 'Vikram Singh', busId: 'BUS03', category: 'Conductor', subject: 'Rude behavior', description: 'The conductor was very rude when I asked about the route change near Ballabgarh. Unprofessional conduct.', status: 'resolved', date: '2026-02-15', response: 'The conductor has been warned. Thank you for reporting.' },
    { id: 'CMP004', studentId: 'STU003', studentName: 'Rahul Verma', busId: 'BUS02', category: 'Other', subject: 'Bus arriving late regularly', description: 'Bus GK-02 has been arriving 15-20 minutes late at Saket Metro for the past week. This affects our first class.', status: 'pending', date: '2026-02-22', response: null },
    { id: 'CMP005', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Seat', subject: 'AC not working properly', description: 'The air conditioning on the left side of the bus is not cooling properly on the Sohna Road stretch.', status: 'in_progress', date: '2026-02-24', response: 'Technician will inspect tomorrow.' },
];

// Seat layouts for buses (2+2 configuration with aisle, last row 3 seats)
// 12 rows × 4 seats = 48, + 1 last row × 3 seats = 51 total
export function generateSeatLayout(busId, capacity) {
    const fullRows = Math.floor(capacity / 4);      // 12 full rows
    const lastRowSeats = capacity % 4;               // 3 remaining seats
    const layout = [];
    const bookedSeats = getBookedSeats(busId);
    const labels = ['A', 'B', 'C', 'D'];

    // Full rows (4 seats each)
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

    // Last row (3 seats for 51-seat buses)
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

// Simulated bus positions (for live tracking, near GD Goenka / Sohna / Gurugram)
export const busPositions = {
    BUS01: { lat: 28.4200, lng: 77.0450, heading: 180, speed: 35 },
    BUS02: { lat: 28.5230, lng: 77.1900, heading: 120, speed: 28 },
    BUS03: { lat: 28.3400, lng: 77.3200, heading: 200, speed: 40 },
    BUS04: { lat: 28.2570, lng: 77.0500, heading: 0, speed: 0 },
    BUS05: { lat: 28.2400, lng: 77.0650, heading: 300, speed: 32 },
};
