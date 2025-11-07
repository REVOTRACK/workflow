
import React, { useState } from 'react';
import type { EncodingResult } from '../types';
import { Button } from './Button';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';

type OutputFormat = 'url' | 'html' | 'markdown';

interface OutputPanelProps {
    results: EncodingResult[];
}

const formatResults = (results: EncodingResult[], format: OutputFormat): string => {
    if (!results.length) return '';
    return results.map(r => {
        const label = r.original.length > 30 ? r.original.substring(0, 27) + '...' : r.original;
        switch (format) {
            case 'html':
                return `<a href="${r.encoded}">${label}</a>`;
            case 'markdown':
                return `[${label}](${r.encoded})`;
            case 'url':
            default:
                return r.encoded;
        }
    }).join('\n');
};

const exportToCsv = (results: EncodingResult[]) => {
    if (!results.length) return;
    const header = 'Original URL,Encoded URL\n';
    const csvContent = results.map(r => `"${r.original.replace(/"/g, '""')}","${r.encoded.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'encoded_urls.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ results }) => {
    const [activeTab, setActiveTab] = useState<OutputFormat>('url');
    const [copyStatus, setCopyStatus] = useState('');

    const outputText = formatResults(results, activeTab);

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
        }).catch(() => {
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus(''), 2000);
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 h-full flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-semibold text-slate-800">Output Matrix</h2>
                 {results.length > 0 && (
                    <Button onClick={() => exportToCsv(results)} variant="secondary" size="md">
                         <DownloadIcon className="w-4 h-4 mr-2" />
                         Export CSV
                    </Button>
                 )}
            </div>
           
            <div className="flex space-x-1 border-b border-slate-200 mb-2">
                {(['url', 'html', 'markdown'] as OutputFormat[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === tab ? 'border-green-500 text-green-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="relative flex-grow">
                <textarea
                    readOnly
                    value={results.length > 0 ? outputText : 'Awaiting encoding operation...'}
                    className="w-full h-full bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-700 resize-none font-mono text-sm"
                    rows={15}
                />
                <div className="absolute top-2 right-2">
                    <Button onClick={handleCopy} variant="secondary" size="sm" disabled={!outputText}>
                       {copyStatus ? copyStatus : <><CopyIcon className="w-4 h-4 mr-2" /> Copy</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};