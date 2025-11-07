
import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';

interface LogPanelProps {
    logs: LogEntry[];
}

const logTypeClasses: Record<LogEntry['type'], string> = {
    info: 'text-gray-300',
    success: 'text-green-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="px-4 py-2 border-b border-slate-200 text-slate-800 text-sm font-semibold">
                System Log
            </div>
            <div
                ref={logContainerRef}
                className="h-48 overflow-y-auto p-4 text-sm font-mono bg-slate-900 rounded-b-lg"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex">
                        <span className="text-gray-500 mr-3">{log.timestamp}</span>
                        <span className={`${logTypeClasses[log.type]} flex-1 whitespace-pre-wrap`}>{log.message}</span>
                    </div>
                ))}
                <div className="flex">
                    <span className="text-gray-500 mr-3 invisible">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span className="text-yellow-400 animate-pulse">_</span>
                </div>
            </div>
        </div>
    );
};