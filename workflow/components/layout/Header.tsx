
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            {user && (
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <div className="text-sm font-medium text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500">Online</div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
            )}
        </header>
    );
};