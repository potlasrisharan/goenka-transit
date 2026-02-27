import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/AnimatedBackground';
import './Login.css';

const redirectPaths = {
    transport_head: '/transport/dashboard',
    student: '/student/dashboard',
    faculty: '/faculty/dashboard',
};

const roleHints = [
    { prefix: 'student', password: 'student123', icon: '🧑‍🎓' },
    { prefix: 'faculty', password: 'faculty123', icon: '👩‍🏫' },
    { prefix: 'transport', password: 'admin123', icon: '🧑‍💼' },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email.toLowerCase().trim(), password);
        if (result.success) {
            navigate(redirectPaths[result.role] || '/');
        } else {
            setError(result.error);
        }
    };

    const fillDemo = (prefix, pwd) => {
        setEmail(`${prefix}@gdgu.org`);
        setPassword(pwd);
        setError('');
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
                    <p className="login-subtitle">GD Goenka University – Campus Transportation</p>
                </motion.div>

                <motion.div
                    className="login-form-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="login-form-card glass-panel-glow">
                        <div className="form-header">
                            <span className="form-role-icon">🔐</span>
                            <h2>Sign In</h2>
                        </div>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. student@gdgu.org"
                                    required
                                    id="login-email"
                                />
                                <span className="form-hint">Use your @gdgu.org email</span>
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
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="login-error"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.button
                                type="submit"
                                className="login-submit-btn"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                id="login-submit"
                            >
                                {isLoading ? (
                                    <span className="login-spinner" />
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>
                        </form>

                        <div className="login-demo-section">
                            <span className="demo-label">Quick Demo Access</span>
                            <div className="demo-buttons">
                                {roleHints.map((hint) => (
                                    <motion.button
                                        key={hint.prefix}
                                        className="demo-btn"
                                        onClick={() => fillDemo(hint.prefix, hint.password)}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        type="button"
                                        id={`demo-${hint.prefix}`}
                                    >
                                        <span>{hint.icon}</span>
                                        <span>{hint.prefix}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
