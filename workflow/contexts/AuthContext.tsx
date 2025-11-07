
import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    users: User[];
    login: (name: string, password: string) => void;
    logout: () => void;
    signup: (name: string, password: string) => void;
    updateUser: (updatedUser: Omit<User, 'password'>) => void;
    updatePassword: (currentPassword: string, newPassword: string) => void;
    createUser: (name: string, password: string) => void;
    deleteUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('users');
            const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
            if (allUsers.length === 0) {
                // Create a default admin user if no users exist
                const adminUser: User = { id: '1', name: 'admin', password: 'password', avatar: 'A', status: 'online' };
                allUsers.push(adminUser);
                localStorage.setItem('users', JSON.stringify(allUsers));
            }
            setUsers(allUsers);
            
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
                const loggedInUser = JSON.parse(storedUser);
                // Make sure the logged-in user still exists in our user list
                if (allUsers.find(u => u.id === loggedInUser.id)) {
                    setUser(loggedInUser);
                } else {
                    // Stale user data, clear it
                    localStorage.removeItem('authUser');
                }
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            localStorage.removeItem('users');
            localStorage.removeItem('authUser');
        }
    }, []);

    const login = (name: string, password: string) => {
        const foundUser = users.find(u => u.name === name && u.password === password);
        if (foundUser) {
            const userData: User = { ...foundUser, status: 'online' };
            delete userData.password; // Don't store password in the active user state
            localStorage.setItem('authUser', JSON.stringify(userData));
            setUser(userData);
        } else {
            throw new Error('Invalid username or password.');
        }
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        setUser(null);
    };

    const signup = (name: string, password: string) => {
        createUser(name, password);
        login(name, password); // Automatically log in after signup
    };
    
    const createUser = (name: string, password: string) => {
        if (users.find(u => u.name === name)) {
            throw new Error('Username already exists.');
        }
        const newUser: User = {
            id: String(Date.now()),
            name,
            password,
            avatar: name.charAt(0).toUpperCase(),
            status: 'offline'
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const deleteUser = (userId: string) => {
        if (user?.id === userId) {
            throw new Error("You cannot delete your own account.");
        }
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };
    
    const updateUser = (updatedUserInfo: Omit<User, 'password'>) => {
        if (!user) throw new Error("Not logged in");
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, name: updatedUserInfo.name, avatar: updatedUserInfo.name.charAt(0).toUpperCase() } : u);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        const newActiveUser = { ...user, name: updatedUserInfo.name, avatar: updatedUserInfo.name.charAt(0).toUpperCase() };
        setUser(newActiveUser);
        localStorage.setItem('authUser', JSON.stringify(newActiveUser));
    };

    const updatePassword = (currentPassword: string, newPassword: string) => {
        if (!user) throw new Error("Not logged in");
        const userInDb = users.find(u => u.id === user.id);
        if (!userInDb || userInDb.password !== currentPassword) {
            throw new Error("Incorrect current password.");
        }
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, password: newPassword } : u);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return (
        <AuthContext.Provider value={{ user, users, login, logout, signup, updateUser, updatePassword, createUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};