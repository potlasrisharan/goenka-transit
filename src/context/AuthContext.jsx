import { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        const found = users.find(u => u.email === email && u.password === password);
        setIsLoading(false);
        if (found) {
            setUser(found);
            return { success: true, role: found.role };
        }
        return { success: false, error: 'Invalid email or password' };
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
