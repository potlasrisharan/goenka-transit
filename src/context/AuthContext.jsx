import { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

// Role mapping from email prefix → internal role
const ROLE_MAP = {
    student: 'student',
    faculty: 'faculty',
    transport: 'transport_head',
};

// Password mapping for demo credentials
const PASSWORD_MAP = {
    student: 'student123',
    faculty: 'faculty123',
    transport: 'admin123',
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setIsLoading(false);

        // Validate email format: must be lowercase prefix + @gdgu.org
        const emailRegex = /^[a-z]+@gdgu\.org$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Invalid email. Must be in the format: role@gdgu.org' };
        }

        // Extract prefix and determine role
        const prefix = email.split('@')[0];
        const role = ROLE_MAP[prefix];

        if (!role) {
            return { success: false, error: `Unauthorized role "${prefix}". Valid roles: student, faculty, transport` };
        }

        // Validate password
        if (password !== PASSWORD_MAP[prefix]) {
            return { success: false, error: 'Invalid password' };
        }

        // Find matching user from mock data, or create a default user object
        const found = users.find(u => u.email === email) || users.find(u => u.role === role);
        const userData = found
            ? { ...found, role }
            : { id: prefix.toUpperCase() + '001', name: prefix.charAt(0).toUpperCase() + prefix.slice(1), email, role, avatar: '👤' };

        setUser(userData);
        return { success: true, role };
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = { user, isLoading, login, logout, isAuthenticated: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
