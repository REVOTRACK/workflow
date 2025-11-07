
import React, { useState, useCallback, useRef } from 'react';
import type { LogEntry } from '../types';
import { Button } from '../components/Button';
import { LogPanel } from '../components/LogPanel';
import { ProgressBar } from '../components/ProgressBar';
import { CopyIcon } from '../components/icons/CopyIcon';
import { useSound } from '../hooks/useSound';

const AVAILABLE_REGIONS = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ca-central-1', 'ca-west-1',
    'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
    'eu-south-1', 'eu-south-2', 'ap-south-1', 'ap-south-2', 'ap-southeast-1',
    'ap-southeast-2', 'ap-southeast-3', 'ap-southeast-4', 'ap-northeast-1',
    'ap-northeast-2', 'ap-northeast-3', 'ap-east-1', 'sa-east-1', 'me-south-1',
    'me-central-1', 'il-central-1', 'af-south-1'
];

const Panel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 h-full shadow-sm ${className}`}>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
);

const FileInput: React.FC<{ file: File | null; setFile: (file: File | null) => void; accept: string; label: string; }> = ({ file, setFile, accept, label }) => (
    <div>
        <Label>{label}</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-slate-500">
                    <label htmlFor={`file-upload-${label}`} className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:ring-green-500">
                        <span>Upload a file</span>
                        <input id={`file-upload-${label}`} name={`file-upload-${label}`} type="file" className="sr-only" accept={accept} onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">{file ? file.name : 'No file selected'}</p>
            </div>
        </div>
    </div>
);

const OutputArea: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [copyStatus, setCopyStatus] = useState('');
    
    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
        }).catch(() => {
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus(''), 2000);
        });
    };

    return (
        <div className="relative">
            <Label>{title}</Label>
            <textarea
                readOnly
                value={content}
                className="w-full h-32 bg-slate-50 border border-slate-300 rounded-md p-2 text-slate-700 resize-none font-mono text-sm"
            />
             <div className="absolute top-8 right-2">
                <Button onClick={handleCopy} variant="secondary" size="sm" disabled={!content}>
                   {copyStatus ? copyStatus : <><CopyIcon className="w-4 h-4 mr-2" /> Copy</>}
                </Button>
            </div>
        </div>
    );
};


export const S3LinkGeneratorTool: React.FC = () => {
    // Inputs
    const [accessKey, setAccessKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [region, setRegion] = useState('us-east-1');
    const [numBuckets, setNumBuckets] = useState(1);
    const [htmlFile, setHtmlFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Outputs & State
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [htmlLinks, setHtmlLinks] = useState('');
    const [imageLinks, setImageLinks] = useState('');

    const logIdCounter = useRef(0);
    const { playSound } = useSound();

    const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, { id: logIdCounter.current++, timestamp, message, type }]);
    }, []);

    const randomString = (length: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const randomBucketName = () => `${randomString(10)}-${randomString(6)}-${randomString(6)}`;
    const randomObjectName = (length = 30) => randomString(length);
    
    const handleGenerate = async () => {
        if (!accessKey || !secretKey || !htmlFile || !imageFile) {
            addLog('Please fill all credentials and select files.', 'error');
            return;
        }
        
        setIsLoading(true);
        setProgress(0);
        setLogs([]);
        setHtmlLinks('');
        setImageLinks('');
        addLog('S3 link generation process initiated...');
        addLog('NOTE: This is a safe simulation. No real AWS resources will be created.', 'warn');

        let newHtmlLinks: string[] = [];
        let newImageLinks: string[] = [];
        
        for (let i = 0; i < numBuckets; i++) {
            const bucketName = randomBucketName();
            addLog(`[${i+1}/${numBuckets}] Creating bucket: ${bucketName}...`);
            await new Promise(r => setTimeout(r, 250)); // Simulate network delay
            addLog(`[${i+1}/${numBuckets}] ✅ Bucket "${bucketName}" configured.`, 'success');

            const htmlKey = randomObjectName();
            const imageKey = randomObjectName();
            
            addLog(`[${i+1}/${numBuckets}] Uploading HTML file: ${htmlFile.name}...`);
            await new Promise(r => setTimeout(r, 250));
            const htmlUrl = `https://${bucketName}.s3.dualstack.${region}.amazonaws.com/${htmlKey}`;
            newHtmlLinks.push(htmlUrl);
            addLog(`[${i+1}/${numBuckets}] 📄 HTML uploaded: ${htmlUrl}`);
            
            addLog(`[${i+1}/${numBuckets}] Uploading image file: ${imageFile.name}...`);
            await new Promise(r => setTimeout(r, 250));
            const imageUrl = `https://${bucketName}.s3.dualstack.${region}.amazonaws.com/${imageKey}`;
            newImageLinks.push(imageUrl);
            addLog(`[${i+1}/${numBuckets}] 🖼️ Image uploaded: ${imageUrl}`);

            setProgress(((i + 1) / numBuckets) * 100);
        }

        setHtmlLinks(newHtmlLinks.join('\n'));
        setImageLinks(newImageLinks.join('\n'));
        addLog('Simulation complete. All links generated.', 'success');
        playSound();
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="w-full mx-auto flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                    <Panel title="S3 Configuration">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="access-key">AWS Access Key</Label>
                                <Input id="access-key" type="password" value={accessKey} onChange={e => setAccessKey(e.target.value)} placeholder="AKIA..."/>
                            </div>
                             <div>
                                <Label htmlFor="secret-key">AWS Secret Key</Label>
                                <Input id="secret-key" type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="Your secret key"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="region">Region</Label>
                                    <Select id="region" value={region} onChange={e => setRegion(e.target.value)}>
                                        {AVAILABLE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="num-buckets">Number of Buckets</Label>
                                    <Input id="num-buckets" type="number" min="1" max="10" value={numBuckets} onChange={e => setNumBuckets(parseInt(e.target.value, 10))}/>
                                </div>
                            </div>
                            <FileInput file={htmlFile} setFile={setHtmlFile} accept=".html" label="HTML File" />
                            <FileInput file={imageFile} setFile={setImageFile} accept="image/png, image/jpeg, image/gif" label="Image File" />
                            <Button onClick={handleGenerate} disabled={isLoading} fullWidth size="lg">
                                {isLoading ? 'GENERATING...' : 'GENERATE LINKS'}
                            </Button>
                        </div>
                    </Panel>
                </div>
                <div className="lg:w-1/2">
                     <Panel title="Generated Links">
                        <div className="space-y-4">
                            <OutputArea title="HTML Links" content={htmlLinks} />
                            <OutputArea title="Image Links" content={imageLinks} />
                        </div>
                    </Panel>
                </div>
            </div>
             <div className="w-full mx-auto">
                {isLoading && <ProgressBar progress={progress} />}
                <LogPanel logs={logs} />
            </div>
        </div>
    );
};
