/* ============ MOCK DATA FOR GOENKA TRANSIT ============ */

// Users
export const users = [
    { id: 'TH001', name: 'Dr. Rajesh Kumar', email: 'transport@goenka.edu', password: 'admin123', role: 'transport_head', phone: '+91 98765 43210', avatar: '🧑‍💼' },
    { id: 'STU001', name: 'Arjun Sharma', email: 'arjun@student.goenka.edu', password: 'student123', role: 'student', phone: '+91 90000 11111', avatar: '🧑‍🎓', busId: 'BUS01', seatNumber: 'A3', routeId: 'R1', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU002', name: 'Priya Patel', email: 'priya@student.goenka.edu', password: 'student123', role: 'student', phone: '+91 90000 22222', avatar: '👩‍🎓', busId: 'BUS01', seatNumber: 'B2', routeId: 'R1', feePaid: false, semester: 'Spring 2026' },
    { id: 'STU003', name: 'Rahul Verma', email: 'rahul@student.goenka.edu', password: 'student123', role: 'student', phone: '+91 90000 33333', avatar: '🧑‍🎓', busId: 'BUS02', seatNumber: 'A1', routeId: 'R2', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU004', name: 'Sneha Gupta', email: 'sneha@student.goenka.edu', password: 'student123', role: 'student', phone: '+91 90000 44444', avatar: '👩‍🎓', busId: 'BUS02', seatNumber: null, routeId: 'R2', feePaid: true, semester: 'Spring 2026' },
    { id: 'STU005', name: 'Vikram Singh', email: 'vikram@student.goenka.edu', password: 'student123', role: 'student', phone: '+91 90000 55555', avatar: '🧑‍🎓', busId: 'BUS03', seatNumber: 'C4', routeId: 'R3', feePaid: false, semester: 'Spring 2026' },
    { id: 'FAC001', name: 'Prof. Meera Joshi', email: 'meera@faculty.goenka.edu', password: 'faculty123', role: 'faculty', phone: '+91 91111 11111', avatar: '👩‍🏫', busId: 'BUS01', routeId: 'R1', feePaid: true },
    { id: 'FAC002', name: 'Dr. Anand Desai', email: 'anand@faculty.goenka.edu', password: 'faculty123', role: 'faculty', phone: '+91 91111 22222', avatar: '👨‍🏫', busId: 'BUS03', routeId: 'R3', feePaid: true },
];

// Buses
export const buses = [
    { id: 'BUS01', number: 'GK-01', name: 'Goenka Express', capacity: 40, routeId: 'R1', driverId: 'DRV01', status: 'active', totalSeats: 40 },
    { id: 'BUS02', number: 'GK-02', name: 'Campus Cruiser', capacity: 36, routeId: 'R2', driverId: 'DRV02', status: 'active', totalSeats: 36 },
    { id: 'BUS03', number: 'GK-03', name: 'Scholar Shuttle', capacity: 40, routeId: 'R3', driverId: 'DRV03', status: 'active', totalSeats: 40 },
    { id: 'BUS04', number: 'GK-04', name: 'Knowledge Kart', capacity: 32, routeId: 'R4', driverId: 'DRV04', status: 'maintenance', totalSeats: 32 },
    { id: 'BUS05', number: 'GK-05', name: 'Quick Connect', capacity: 36, routeId: 'R5', driverId: 'DRV05', status: 'active', totalSeats: 36 },
];

// Drivers
export const drivers = [
    { id: 'DRV01', name: 'Ramesh Yadav', phone: '+91 80000 11111', license: 'DL-2024-001234', busId: 'BUS01', status: 'on_duty', experience: '8 yrs', photo: '🧔', rating: 4.6, conductorName: 'Suresh Kumar', conductorPhone: '+91 80000 11112' },
    { id: 'DRV02', name: 'Vijay Patil', phone: '+91 80000 22222', license: 'DL-2024-005678', busId: 'BUS02', status: 'on_duty', experience: '5 yrs', photo: '👨', rating: 4.8, conductorName: 'Manoj Tiwari', conductorPhone: '+91 80000 22223' },
    { id: 'DRV03', name: 'Kiran Babu', phone: '+91 80000 33333', license: 'DL-2024-009101', busId: 'BUS03', status: 'on_duty', experience: '12 yrs', photo: '👴', rating: 4.9, conductorName: 'Ashok Reddy', conductorPhone: '+91 80000 33334' },
    { id: 'DRV04', name: 'Deepak Sharma', phone: '+91 80000 44444', license: 'DL-2024-001122', busId: 'BUS04', status: 'off_duty', experience: '3 yrs', photo: '🧑', rating: 4.3, conductorName: 'Ravi Das', conductorPhone: '+91 80000 44445' },
    { id: 'DRV05', name: 'Sanjay Mishra', phone: '+91 80000 55555', license: 'DL-2024-003344', busId: 'BUS05', status: 'on_duty', experience: '7 yrs', photo: '👤', rating: 4.5, conductorName: 'Amit Shah', conductorPhone: '+91 80000 55556' },
];

// Routes (Coordinates near Hyderabad as a reference campus area)
export const routes = [
    {
        id: 'R1', name: 'Route A – Hitech City Loop',
        stops: [
            { name: 'Campus Gate', lat: 17.4435, lng: 78.3772, time: '7:00 AM' },
            { name: 'Hitech City', lat: 17.4486, lng: 78.3908, time: '7:20 AM' },
            { name: 'Madhapur', lat: 17.4400, lng: 78.3964, time: '7:35 AM' },
            { name: 'Kondapur', lat: 17.4574, lng: 78.3687, time: '7:50 AM' },
            { name: 'Gachibowli', lat: 17.4401, lng: 78.3489, time: '8:05 AM' },
            { name: 'Campus Main', lat: 17.4435, lng: 78.3772, time: '8:20 AM' },
        ],
        totalDistance: '18 km',
        estimatedTime: '1 hr 20 min',
        color: '#6c5ce7',
    },
    {
        id: 'R2', name: 'Route B – Jubilee Hills Express',
        stops: [
            { name: 'Campus Gate', lat: 17.4435, lng: 78.3772, time: '7:00 AM' },
            { name: 'Jubilee Hills', lat: 17.4318, lng: 78.4071, time: '7:25 AM' },
            { name: 'Banjara Hills', lat: 17.4156, lng: 78.4347, time: '7:40 AM' },
            { name: 'Begumpet', lat: 17.4399, lng: 78.4648, time: '7:55 AM' },
            { name: 'Campus Main', lat: 17.4435, lng: 78.3772, time: '8:15 AM' },
        ],
        totalDistance: '22 km',
        estimatedTime: '1 hr 15 min',
        color: '#00cec9',
    },
    {
        id: 'R3', name: 'Route C – Kukatpally Connector',
        stops: [
            { name: 'Campus Gate', lat: 17.4435, lng: 78.3772, time: '6:50 AM' },
            { name: 'KPHB Colony', lat: 17.4893, lng: 78.3978, time: '7:15 AM' },
            { name: 'Kukatpally', lat: 17.4948, lng: 78.3996, time: '7:30 AM' },
            { name: 'Miyapur', lat: 17.4969, lng: 78.3548, time: '7:50 AM' },
            { name: 'Chandanagar', lat: 17.4945, lng: 78.3296, time: '8:05 AM' },
            { name: 'Campus Main', lat: 17.4435, lng: 78.3772, time: '8:25 AM' },
        ],
        totalDistance: '25 km',
        estimatedTime: '1 hr 35 min',
        color: '#fd79a8',
    },
    {
        id: 'R4', name: 'Route D – Secunderabad Link',
        stops: [
            { name: 'Campus Gate', lat: 17.4435, lng: 78.3772, time: '6:45 AM' },
            { name: 'Ameerpet', lat: 17.4374, lng: 78.4487, time: '7:15 AM' },
            { name: 'Secunderabad', lat: 17.4399, lng: 78.4983, time: '7:40 AM' },
            { name: 'Malkajgiri', lat: 17.4523, lng: 78.5097, time: '8:00 AM' },
            { name: 'Campus Main', lat: 17.4435, lng: 78.3772, time: '8:30 AM' },
        ],
        totalDistance: '30 km',
        estimatedTime: '1 hr 45 min',
        color: '#fdcb6e',
    },
    {
        id: 'R5', name: 'Route E – LB Nagar Shuttle',
        stops: [
            { name: 'Campus Gate', lat: 17.4435, lng: 78.3772, time: '6:40 AM' },
            { name: 'Mehdipatnam', lat: 17.3950, lng: 78.4425, time: '7:10 AM' },
            { name: 'Dilsukhnagar', lat: 17.3688, lng: 78.5247, time: '7:35 AM' },
            { name: 'LB Nagar', lat: 17.3482, lng: 78.5513, time: '7:55 AM' },
            { name: 'Campus Main', lat: 17.4435, lng: 78.3772, time: '8:30 AM' },
        ],
        totalDistance: '35 km',
        estimatedTime: '1 hr 50 min',
        color: '#e17055',
    },
];

// Complaints
export const complaints = [
    { id: 'CMP001', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Driver', subject: 'Rash driving near Madhapur', description: 'The driver was going very fast near the Madhapur junction yesterday. It felt unsafe.', status: 'pending', date: '2026-02-20', response: null },
    { id: 'CMP002', studentId: 'STU002', studentName: 'Priya Patel', busId: 'BUS01', category: 'Seat', subject: 'Broken seat cushion', description: 'Seat B2 has a torn cushion and the spring is poking through. Needs immediate replacement.', status: 'in_progress', date: '2026-02-18', response: 'Maintenance scheduled for this weekend.' },
    { id: 'CMP003', studentId: 'STU005', studentName: 'Vikram Singh', busId: 'BUS03', category: 'Conductor', subject: 'Rude behavior', description: 'The conductor was very rude when I asked about the route change. Unprofessional conduct.', status: 'resolved', date: '2026-02-15', response: 'The conductor has been warned. Thank you for reporting.' },
    { id: 'CMP004', studentId: 'STU003', studentName: 'Rahul Verma', busId: 'BUS02', category: 'Other', subject: 'Bus arriving late regularly', description: 'Bus GK-02 has been arriving 15-20 minutes late for the past week. This affects our first class.', status: 'pending', date: '2026-02-22', response: null },
    { id: 'CMP005', studentId: 'STU001', studentName: 'Arjun Sharma', busId: 'BUS01', category: 'Seat', subject: 'AC not working properly', description: 'The air conditioning on the left side of the bus is not cooling properly.', status: 'in_progress', date: '2026-02-24', response: 'Technician will inspect tomorrow.' },
];

// Seat layouts for buses (2+2 configuration with aisle)
export function generateSeatLayout(busId, capacity) {
    const rows = Math.ceil(capacity / 4);
    const layout = [];
    const bookedSeats = getBookedSeats(busId);

    for (let r = 0; r < rows; r++) {
        const row = [];
        const labels = ['A', 'B', 'C', 'D'];
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
    { id: 'IV001', facultyId: 'FAC001', facultyName: 'Prof. Meera Joshi', destination: 'Infosys Campus, Hyderabad', date: '2026-03-15', students: 35, purpose: 'Industry exposure visit for CS students', status: 'approved', busAssigned: 'BUS04', createdAt: '2026-02-10' },
    { id: 'IV002', facultyId: 'FAC002', facultyName: 'Dr. Anand Desai', destination: 'Bharat Biotech, Genome Valley', date: '2026-03-22', students: 28, purpose: 'Biotech lab visit for Biology department', status: 'pending', busAssigned: null, createdAt: '2026-02-20' },
    { id: 'IV003', facultyId: 'FAC001', facultyName: 'Prof. Meera Joshi', destination: 'DRDO Labs, Kanchanbagh', date: '2026-04-05', students: 40, purpose: 'Research methodology workshop', status: 'pending', busAssigned: null, createdAt: '2026-02-24' },
];

// Fee details
export const feeStructure = {
    semesterFee: 15000,
    lateFee: 500,
    dueDate: '2026-03-01',
    paymentMethods: ['Online Banking', 'UPI', 'Campus Counter'],
};

// Simulated bus positions (for live tracking)
export const busPositions = {
    BUS01: { lat: 17.4460, lng: 78.3850, heading: 45, speed: 35 },
    BUS02: { lat: 17.4300, lng: 78.4100, heading: 120, speed: 28 },
    BUS03: { lat: 17.4880, lng: 78.3960, heading: 200, speed: 40 },
    BUS04: { lat: 17.4435, lng: 78.3772, heading: 0, speed: 0 },
    BUS05: { lat: 17.3900, lng: 78.4400, heading: 300, speed: 32 },
};
