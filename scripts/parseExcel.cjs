/**
 * Parse GDGU BUS ROUTES Excel and generate SQL seed data.
 * Run: node scripts/parseExcel.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = '/Users/potlasrisharanchowdary/Downloads/GDGU BUS ROUTES JAN-JUN 2026.xlsx';
const OUTPUT_PATH = path.resolve(__dirname, '../supabase-seed.sql');

const wb = XLSX.readFile(EXCEL_PATH);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

const routeColors = ['#6c5ce7', '#00b894', '#e17055', '#0984e3', '#fdcb6e', '#e84393', '#00cec9', '#a29bfe', '#fab1a0', '#55efc4', '#74b9ff'];

// Parse routes
const parsedRoutes = [];
let currentRoute = null;

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cell0 = String(row[0] || '').trim();

    // Route header: "GDGU ROUTE NO. - XX\nSTART POINT\nDRIVER: ...\nCONDUCTOR: ..."
    if (cell0.startsWith('GDGU ROUTE NO.')) {
        const lines = cell0.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const routeMatch = lines[0].match(/ROUTE NO\.\s*-?\s*(\d+)/);
        const routeNum = routeMatch ? routeMatch[1].padStart(2, '0') : '00';
        const startPoint = lines[1] || '';

        let driverName = '', driverPhone = '', conductorName = '', conductorPhone = '';
        for (const line of lines) {
            const driverMatch = line.match(/DRIVER:\s*(.+?)\s*[\(-]\s*([\d\s]+)/i);
            if (driverMatch) {
                driverName = driverMatch[1].trim().replace(/\s+/g, ' ');
                driverPhone = driverMatch[2].replace(/\s/g, '').replace(/[()]/g, '');
            }
            const conductorMatch = line.match(/CONDUCTOR:\s*(.+?)\s*[\(-]\s*([\d\s]+)/i);
            if (conductorMatch) {
                conductorName = conductorMatch[1].trim().replace(/\s+/g, ' ');
                conductorPhone = conductorMatch[2].replace(/\s/g, '').replace(/[()]/g, '');
            }
        }

        // Determine city from start point
        let city = 'New Delhi';
        if (/GURUGRAM|GURGAON|MANESAR/i.test(startPoint)) city = 'Gurugram';
        if (/FARIDABAD|BALLABH/i.test(startPoint)) city = 'Faridabad';

        currentRoute = {
            id: `R${routeNum}`,
            number: routeNum,
            name: `Route ${routeNum} – ${startPoint}`,
            startPoint,
            city,
            color: routeColors[(parseInt(routeNum) - 1) % routeColors.length],
            driverName,
            driverPhone: driverPhone ? `+91 ${driverPhone}` : '',
            conductorName,
            conductorPhone: conductorPhone ? `+91 ${conductorPhone}` : '',
            stops: [],
        };
        parsedRoutes.push(currentRoute);
        continue;
    }

    // Skip header rows (S.N., GDGU BUS STOP, PICKUP TIME)
    if (cell0 === 'S.N.' || cell0 === '') {
        // Check if this is the destination row (G D GOENKA EDUCATION CITY)
        if (currentRoute && String(row[1] || '').includes('GOENKA')) {
            currentRoute.stops.push({
                name: 'G D Goenka Education City',
                time: String(row[2] || '09.00 AM').trim(),
                order: currentRoute.stops.length + 1,
            });
        }
        continue;
    }

    // Stop row: [number, "STOP NAME", "PICKUP TIME"]
    if (currentRoute && typeof row[0] === 'number') {
        currentRoute.stops.push({
            name: String(row[1] || '').trim(),
            time: String(row[2] || '').trim(),
            order: row[0],
        });
    }
}

// Generate SQL
let sql = `-- =====================================================
-- Goenka Transit – Auto-generated Seed Data
-- Generated from: GDGU BUS ROUTES JAN-JUN 2026.xlsx
-- Routes: ${parsedRoutes.length}, Total stops: ${parsedRoutes.reduce((a, r) => a + r.stops.length, 0)}
-- =====================================================

`;

// Routes
sql += `-- ROUTES\n`;
for (const r of parsedRoutes) {
    const esc = (s) => s.replace(/'/g, "''");
    sql += `INSERT INTO routes (id, name, start_point, city, color) VALUES ('${r.id}', '${esc(r.name)}', '${esc(r.startPoint)}', '${esc(r.city)}', '${r.color}');\n`;
}

// Drivers
sql += `\n-- DRIVERS\n`;
for (const r of parsedRoutes) {
    const esc = (s) => s.replace(/'/g, "''");
    const did = `DRV${r.number}`;
    sql += `INSERT INTO drivers (id, name, phone, bus_id, conductor_name, conductor_phone, status, rating) VALUES ('${did}', '${esc(r.driverName)}', '${esc(r.driverPhone)}', 'BUS${r.number}', '${esc(r.conductorName)}', '${esc(r.conductorPhone)}', 'on_duty', ${(4 + Math.random() * 0.9).toFixed(1)});\n`;
}

// Buses
sql += `\n-- BUSES\n`;
for (const r of parsedRoutes) {
    const esc = (s) => s.replace(/'/g, "''");
    const cap = 40;
    sql += `INSERT INTO buses (id, number, name, capacity, total_seats, route_id, driver_id, status) VALUES ('BUS${r.number}', 'GK-${r.number}', '${esc(r.name.replace(/Route \d+ – /, ''))} Bus', ${cap}, ${cap}, '${r.id}', 'DRV${r.number}', 'active');\n`;
}

// Stops
sql += `\n-- STOPS\n`;
for (const r of parsedRoutes) {
    for (const stop of r.stops) {
        const esc = (s) => s.replace(/'/g, "''");
        sql += `INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES ('${r.id}', '${esc(stop.name)}', '${esc(stop.time)}', ${stop.order});\n`;
    }
}

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(`✅ Generated ${OUTPUT_PATH}`);
console.log(`   Routes: ${parsedRoutes.length}`);
console.log(`   Stops: ${parsedRoutes.reduce((a, r) => a + r.stops.length, 0)}`);
console.log(`   Drivers: ${parsedRoutes.length}`);

// Also output JSON for mockData update
const jsonOut = path.resolve(__dirname, '../src/data/excelData.json');
fs.writeFileSync(jsonOut, JSON.stringify(parsedRoutes, null, 2));
console.log(`   JSON: ${jsonOut}`);
