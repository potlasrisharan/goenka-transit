import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTransport } from '../../context/TransportContext';

export default function ShareLocation() {
    const { user } = useAuth();
    const { getBusById } = useTransport();
    const [sharing, setSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    const bus = getBusById(user.busId);
    const shareLink = `${window.location.origin}/parent/track/${user.busId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Share Bus Location</h1>
                <p>Let your parents track your bus in real-time</p>
            </div>

            <motion.div
                className="glass-panel-glow"
                style={{ maxWidth: '600px', padding: 'var(--space-2xl)', margin: '0 auto', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📍</div>
                <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-sm)' }}>Parent Live Tracking</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--fs-sm)' }}>
                    Share a link with your parents so they can track your bus ({bus?.number || '—'}) in real-time on a map.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <motion.button
                        onClick={() => setSharing(!sharing)}
                        style={{
                            padding: '14px 36px',
                            background: sharing ? 'var(--accent-danger)' : 'var(--accent-primary)',
                            color: 'white',
                            borderRadius: 'var(--border-radius-md)',
                            fontWeight: 600,
                            fontSize: 'var(--fs-base)',
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {sharing ? '🔴 Stop Sharing' : '🟢 Enable Sharing'}
                    </motion.button>

                    {sharing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%' }}
                        >
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Share this link with your parent:</p>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={shareLink}
                                    readOnly
                                    style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
                                />
                                <motion.button
                                    onClick={handleCopy}
                                    style={{ padding: '10px 20px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--border-radius-md)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {copied ? '✅ Copied!' : '📋 Copy'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
