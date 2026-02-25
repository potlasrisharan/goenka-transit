import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import './Login.css';

const roles = [
    { key: 'transport_head', label: 'Transport Head', icon: '🧑‍💼', desc: 'Manage fleet, drivers & routes', color: '#6c5ce7', defaultEmail: 'transport@goenka.edu' },
    { key: 'student', label: 'Student', icon: '🧑‍🎓', desc: 'Book seats & track your bus', color: '#00cec9', defaultEmail: 'arjun@student.goenka.edu' },
    { key: 'faculty', label: 'Faculty', icon: '👩‍🏫', desc: 'View transport & request visits', color: '#fd79a8', defaultEmail: 'meera@faculty.goenka.edu' },
];

const redirectPaths = {
    transport_head: '/transport/dashboard',
    student: '/student/dashboard',
    faculty: '/faculty/dashboard',
};

export default function Login() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setEmail(role.defaultEmail);
        setPassword(role.key === 'transport_head' ? 'admin123' : role.key === 'student' ? 'student123' : 'faculty123');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate(redirectPaths[result.role] || '/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-page">
            <AnimatedBackground />
            <div className="login-container">
                <motion.div
                    className="login-hero"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="login-logo">🚌</span>
                    <h1 className="login-title">Goenka Transit</h1>
                    <p className="login-subtitle">Campus Transportation Management System</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!selectedRole ? (
                        <motion.div
                            key="role-select"
                            className="role-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="role-heading">Select Access Portal</h2>
                            <div className="role-cards">
                                {roles.map((role, i) => (
                                    <motion.button
                                        key={role.key}
                                        className="role-card"
                                        id={`role-${role.key}`}
                                        onClick={() => handleRoleSelect(role)}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: `0 10px 40px ${role.color}30` }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{ '--card-accent': role.color }}
                                    >
                                        <span className="role-card-icon">{role.icon}</span>
                                        <span className="role-card-label">{role.label}</span>
                                        <span className="role-card-desc">{role.desc}</span>
                                        <div className="role-card-glow" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login-form"
                            className="login-form-container"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button className="back-btn" onClick={() => setSelectedRole(null)} id="back-to-roles">
                                ← Back to Portal Selection
                            </button>
                            <div className="login-form-card glass-panel-glow" style={{ '--card-accent': selectedRole.color }}>
                                <div className="form-header">
                                    <span className="form-role-icon">{selectedRole.icon}</span>
                                    <h2>{selectedRole.label} Login</h2>
                                </div>
                                <form onSubmit={handleLogin} className="login-form">
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            id="login-email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            id="login-password"
                                        />
                                    </div>
                                    {error && (
                                        <motion.div
                                            className="login-error"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                    <motion.button
                                        type="submit"
                                        className="login-submit-btn"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ background: selectedRole.color }}
                                        id="login-submit"
                                    >
                                        {isLoading ? (
                                            <span className="login-spinner" />
                                        ) : (
                                            'Sign In'
                                        )}
                                    </motion.button>
                                </form>
                                <div className="login-hint">
                                    <span>Demo credentials are pre-filled</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
