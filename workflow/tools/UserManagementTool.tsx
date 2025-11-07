
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { useSound } from '../hooks/useSound';

const Panel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm ${className}`}>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
);


export const UserManagementTool: React.FC = () => {
    const { user: adminUser, users, createUser, deleteUser } = useAuth();
    const { playSound } = useSound();
    
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        if (!newUsername || !newPassword) {
            setMessage({ text: 'Username and password are required.', type: 'error' });
            return;
        }

        try {
            createUser(newUsername, newPassword);
            setMessage({ text: `User "${newUsername}" created successfully!`, type: 'success' });
            playSound();
            setNewUsername('');
            setNewPassword('');
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Failed to create user.', type: 'error' });
        }
    };
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                deleteUser(userId);
                setMessage({ text: 'User deleted successfully!', type: 'success' });
                playSound();
            } catch (err) {
                 setMessage({ text: err instanceof Error ? err.message : 'Failed to delete user.', type: 'error' });
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Panel title="Create New User">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="newUsername">Username</Label>
                            <Input
                                id="newUsername"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="e.g., team_member"
                            />
                        </div>
                        <div>
                            <Label htmlFor="newPassword">Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter a secure password"
                            />
                        </div>
                    </div>
                     <div className="flex items-center justify-between pt-2">
                         {message.text && (
                            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </p>
                        )}
                        <Button type="submit" size="md" className="ml-auto">Create User</Button>
                    </div>
                </form>
            </Panel>
            
            <Panel title="Manage Users">
                 <div className="divide-y divide-slate-200">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold">{user.avatar}</div>
                                <div>
                                    <p className="font-medium text-slate-800">{user.name} {user.id === adminUser?.id && <span className="text-xs text-green-600 font-normal">(You)</span>}</p>
                                    <p className="text-xs text-slate-500">User ID: {user.id}</p>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="sm"
                                disabled={user.id === adminUser?.id}
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                 </div>
            </Panel>
        </div>
    );
};
