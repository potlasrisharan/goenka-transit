import { createClient } from '@supabase/supabase-js';
import { routes, buses, drivers, users, complaints, industrialVisits } from './src/data/mockData.js';

const supabase = createClient(
    'https://iuqrkpoecjqovhvotyit.supabase.co',
    'sb_publishable_4HBGhrc13FqgKvtersTwDg_RTch8U8Y'
);

async function seed() {
    try {
        console.log('Seeding Routes & Stops...');
        const routeData = routes.map(r => ({
            id: r.id, name: r.name, start_point: r.startPoint,
            city: r.city, color: r.color
        }));
        await supabase.from('routes').upsert(routeData);

        const stopsData = [];
        routes.forEach(r => {
            let order = 1;
            (r.stops || []).forEach(s => {
                stopsData.push({
                    route_id: r.id, name: s.name, stop_order: s.order || order++,
                    pickup_time: s.time, lat: s.lat || null, lng: s.lng || null
                });
            });
        });
        // Clear old stops if any, then insert all to avoid dups without IDs
        await supabase.from('stops').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('stops').insert(stopsData);

        console.log('Seeding Buses...');
        const busData = buses.map(b => ({
            id: b.id, number: b.number, name: b.name, capacity: b.capacity,
            route_id: b.routeId, driver_id: b.driverId, status: b.status, total_seats: b.totalSeats
        }));
        await supabase.from('buses').upsert(busData);

        console.log('Seeding Drivers...');
        const driverData = drivers.map(d => ({
            id: d.id, name: d.name, phone: d.phone, license: d.license,
            bus_id: d.busId, status: d.status, experience: d.experience,
            rating: d.rating, conductor_name: d.conductorName, conductor_phone: d.conductorPhone
        }));
        await supabase.from('drivers').upsert(driverData);

        console.log('Seeding Students & Seats...');
        const studentData = users.filter(u => u.role === 'student').map(s => ({
            id: s.id, name: s.name, email: s.email, phone: s.phone,
            route_id: s.routeId, bus_id: s.busId, seat_number: s.seatNumber, fee_paid: s.feePaid
        }));
        await supabase.from('students').upsert(studentData);

        const seatData = users.filter(u => u.role === 'student' && u.seatNumber && u.busId).map(s => ({
            bus_id: s.busId, seat_number: s.seatNumber, student_id: s.id, status: 'booked'
        }));
        await supabase.from('seats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('seats').insert(seatData);

        console.log('Database seeded successfully in bulk! Your live apps can now freely interact with the relational data.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
