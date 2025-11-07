
import React, { useState, useEffect } from 'react';
import type { Tool } from '../../App';
import { Logo } from '../icons/Logo';
import { CodeIcon } from '../icons/CodeIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { CloudUploadIcon } from '../icons/CloudUploadIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
    activeTool: Tool;
    setActiveTool: (tool: Tool) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const baseClasses = 'flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200';
    const activeClasses = 'bg-green-500 text-white shadow-sm';
    const inactiveClasses = 'text-slate-300 hover:bg-slate-700 hover:text-white';

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
    const { logout, user } = useAuth();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-US', options));
    }, []);

    return (
        <aside className="w-64 bg-[#3a3f51] p-4 flex-shrink-0 flex flex-col">
            <div className="flex items-center justify-center h-16 mb-4">
              <Logo />
            </div>

            <div className="mb-6 p-3 bg-green-500 rounded-lg text-white">
                <div className="font-bold text-sm">Admin - ID: {user?.id}</div>
                <div className="text-xs">{user?.name}</div>
                <div className="mt-2 text-xl font-semibold">{currentDate}</div>
                <div className="text-xs opacity-80">Current Date</div>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem
                    label="Link Encoder"
                    icon={<CodeIcon className="w-5 h-5" />}
                    isActive={activeTool === 'link-encoder'}
                    onClick={() => setActiveTool('link-encoder')}
                />
                 <NavItem
                    label="Team Chat"
                    icon={<ChatBubbleIcon className="w-5 h-5" />}
                    isActive={activeTool === 'team-chat'}
                    onClick={() => setActiveTool('team-chat')}
                />
                <NavItem
                    label="S3 Link Generator"
                    icon={<CloudUploadIcon className="w-5 h-5" />}
                    isActive={activeTool === 's3-link-generator'}
                    onClick={() => setActiveTool('s3-link-generator')}
                />
                 <NavItem
                    label="Account Settings"
                    icon={<UserCircleIcon className="w-5 h-5" />}
                    isActive={activeTool === 'account-settings'}
                    onClick={() => setActiveTool('account-settings')}
                />
                {user?.name === 'admin' && (
                  <>
                    <NavItem
                        label="User Management"
                        icon={<UsersIcon className="w-5 h-5" />}
                        isActive={activeTool === 'user-management'}
                        onClick={() => setActiveTool('user-management')}
                    />
                    <NavItem
                        label="Application Settings"
                        icon={<SettingsIcon className="w-5 h-5" />}
                        isActive={activeTool === 'application-settings'}
                        onClick={() => setActiveTool('application-settings')}
                    />
                  </>
                )}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </aside>
    );
};