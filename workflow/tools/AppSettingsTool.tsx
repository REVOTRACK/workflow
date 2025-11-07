
import React, { useRef, useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

const Panel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm ${className}`}>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

export const AppSettingsTool: React.FC = () => {
    const { user } = useAuth();
    const { customLogo, setCustomLogo, removeCustomLogo } = useSettings();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCustomLogo(base64String);
                setMessage('Logo updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        removeCustomLogo();
        setMessage('Logo removed.');
        setTimeout(() => setMessage(''), 3000);
    };
    
    if (user?.name !== 'admin') {
        return (
            <Panel title="Application Settings">
                <p className="text-slate-600">You do not have permission to view or edit these settings.</p>
            </Panel>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Panel title="Branding">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Application Logo</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                                {customLogo ? (
                                    <img src={customLogo} alt="Current Logo" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <span className="text-xs text-slate-400">Default</span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                    Upload Logo
                                </Button>
                                {customLogo && (
                                     <Button 
                                        variant="secondary" 
                                        onClick={handleRemoveLogo}
                                        className="bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
                                     >
                                        Remove
                                    </Button>
                                )}
                            </div>
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/svg+xml"
                            />
                        </div>
                         {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
                    </div>
                </div>
            </Panel>
        </div>
    );
};