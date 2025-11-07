
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


export const AccountSettingsTool: React.FC = () => {
    const { user, updateUser, updatePassword } = useAuth();
    const { playSound } = useSound();

    const [displayName, setDisplayName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
    
    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage({ text: '', type: '' });
        if (!user || !displayName) return;

        try {
            updateUser({ ...user, name: displayName });
            setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
            playSound();
        } catch (err) {
            setProfileMessage({ text: err instanceof Error ? err.message : 'Failed to update.', type: 'error' });
        }
    };
    
    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ text: '', type: '' });
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }
        if (!currentPassword || !newPassword) {
            setPasswordMessage({ text: 'All password fields are required.', type: 'error' });
            return;
        }
        
        try {
            updatePassword(currentPassword, newPassword);
            setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
            playSound();
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMessage({ text: err instanceof Error ? err.message : 'Failed to change password.', type: 'error' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Panel title="User Profile">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                         {profileMessage.text && (
                            <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {profileMessage.text}
                            </p>
                        )}
                        <Button type="submit" size="md" className="ml-auto">Update Profile</Button>
                    </div>
                </form>
            </Panel>
            
            <Panel title="Change Password">
                 <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                     <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                     <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                         {passwordMessage.text && (
                            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordMessage.text}
                            </p>
                        )}
                        <Button type="submit" size="md" className="ml-auto">Change Password</Button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};
