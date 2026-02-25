import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Layout
import AppLayout from './components/common/AppLayout';

// Pages
import Login from './pages/Login';

// Transport Head
import TransportDashboard from './pages/TransportHead/Dashboard';
import BusTracking from './pages/TransportHead/BusTracking';
import DriverDetails from './pages/TransportHead/DriverDetails';
import ComplaintsManagement from './pages/TransportHead/Complaints';
import StudentManagement from './pages/TransportHead/StudentManagement';
import RouteManagement from './pages/TransportHead/RouteManagement';
import BusChangeApprovals from './pages/TransportHead/BusChangeApprovals';
import VisitApprovals from './pages/TransportHead/VisitApprovals';

// Student
import StudentDashboard from './pages/Student/Dashboard';
import SeatBooking from './pages/Student/SeatBooking';
import StudentComplaints from './pages/Student/Complaints';
import ShareLocation from './pages/Student/ShareLocation';
import BusChangeRequest from './pages/Student/BusChangeRequest';

// Faculty
import FacultyDashboard from './pages/Faculty/Dashboard';
import IndustrialVisits from './pages/Faculty/IndustrialVisits';

// Parent
import LiveTracking from './pages/Parent/LiveTracking';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    const { isAuthenticated, user } = useAuth();

    const getDefaultRoute = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'transport_head': return '/transport/dashboard';
            case 'student': return '/student/dashboard';
            case 'faculty': return '/faculty/dashboard';
            default: return '/login';
        }
    };

    return (
        <AnimatePresence mode="wait">
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />
                <Route path="/parent/track/:busId" element={<LiveTracking />} />

                {/* Protected routes with layout */}
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                    {/* Transport Head */}
                    <Route path="/transport/dashboard" element={<ProtectedRoute allowedRoles={['transport_head']}><TransportDashboard /></ProtectedRoute>} />
                    <Route path="/transport/tracking" element={<ProtectedRoute allowedRoles={['transport_head']}><BusTracking /></ProtectedRoute>} />
                    <Route path="/transport/drivers" element={<ProtectedRoute allowedRoles={['transport_head']}><DriverDetails /></ProtectedRoute>} />
                    <Route path="/transport/complaints" element={<ProtectedRoute allowedRoles={['transport_head']}><ComplaintsManagement /></ProtectedRoute>} />
                    <Route path="/transport/students" element={<ProtectedRoute allowedRoles={['transport_head']}><StudentManagement /></ProtectedRoute>} />
                    <Route path="/transport/route-management" element={<ProtectedRoute allowedRoles={['transport_head']}><RouteManagement /></ProtectedRoute>} />
                    <Route path="/transport/bus-changes" element={<ProtectedRoute allowedRoles={['transport_head']}><BusChangeApprovals /></ProtectedRoute>} />
                    <Route path="/transport/visit-requests" element={<ProtectedRoute allowedRoles={['transport_head']}><VisitApprovals /></ProtectedRoute>} />

                    {/* Student */}
                    <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/student/seat-booking" element={<ProtectedRoute allowedRoles={['student']}><SeatBooking /></ProtectedRoute>} />
                    <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={['student']}><StudentComplaints /></ProtectedRoute>} />
                    <Route path="/student/share-location" element={<ProtectedRoute allowedRoles={['student']}><ShareLocation /></ProtectedRoute>} />
                    <Route path="/student/bus-change" element={<ProtectedRoute allowedRoles={['student']}><BusChangeRequest /></ProtectedRoute>} />

                    {/* Faculty */}
                    <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
                    <Route path="/faculty/industrial-visits" element={<ProtectedRoute allowedRoles={['faculty']}><IndustrialVisits /></ProtectedRoute>} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={isAuthenticated ? getDefaultRoute() : '/login'} replace />} />
            </Routes>
        </AnimatePresence>
    );
}
