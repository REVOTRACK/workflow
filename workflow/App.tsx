
import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LinkEncoderTool } from './tools/LinkEncoderTool';
import { ChatTool } from './tools/ChatTool';
import { S3LinkGeneratorTool } from './tools/S3LinkGeneratorTool';
import { AccountSettingsTool } from './tools/AccountSettingsTool';
import { UserManagementTool } from './tools/UserManagementTool';
import { AppSettingsTool } from './tools/AppSettingsTool';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

export type Tool = 'link-encoder' | 'team-chat' | 's3-link-generator' | 'account-settings' | 'user-management' | 'application-settings';

const toolMetadata: Record<Tool, { name: string; component: React.FC }> = {
    'link-encoder': { name: 'HTML Link Encoder', component: LinkEncoderTool },
    'team-chat': { name: 'Team Chat', component: ChatTool },
    's3-link-generator': { name: 'S3 Link Generator', component: S3LinkGeneratorTool },
    'account-settings': { name: 'Account Settings', component: AccountSettingsTool },
    'user-management': { name: 'User Management', component: UserManagementTool },
    'application-settings': { name: 'Application Settings', component: AppSettingsTool },
};

const App: React.FC = () => {
    const { user } = useAuth();
    const [activeTool, setActiveTool] = useState<Tool>('link-encoder');

    if (!user) {
        return <LoginPage />;
    }

    const ActiveToolComponent = toolMetadata[activeTool].component;

    return (
        <div className="flex h-screen bg-slate-100 text-slate-700 overflow-hidden">
            <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title={toolMetadata[activeTool].name} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <ActiveToolComponent />
                </main>
            </div>
        </div>
    );
};

export default App;