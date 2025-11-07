
import React, { useState, useCallback, useRef } from 'react';
import { InputPanel } from '../components/InputPanel';
import { OutputPanel } from '../components/OutputPanel';
import { LogPanel } from '../components/LogPanel';
import { ProgressBar } from '../components/ProgressBar';
import { encodeUrlSmart } from '../services/encodingService';
import type { EncodingMethod, LogEntry, EncodingResult } from '../types';
import { useSound } from '../hooks/useSound';

export const LinkEncoderTool: React.FC = () => {
    const [inputUrls, setInputUrls] = useState<string>('https://example.com/path/to/resource?query=value#fragment');
    const [encodingMethod1, setEncodingMethod1] = useState<EncodingMethod>('hex');
    const [encodingMethod2, setEncodingMethod2] = useState<EncodingMethod>('percent');
    const [doubleEncode, setDoubleEncode] = useState<boolean>(false);
    const [customMap, setCustomMap] = useState<string>('{\n  "a": " ALPHA ",\n  "b": " BETA "\n}');
    
    const [results, setResults] = useState<EncodingResult[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const logIdCounter = useRef(0);
    const { playSound } = useSound();

    const addLog = useCallback((message: string, type: 'info' | 'error' | 'success' | 'warn' = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prevLogs => [...prevLogs, { id: logIdCounter.current++, timestamp, message, type }]);
    }, []);

    const handleEncode = useCallback(async () => {
        setIsLoading(true);
        setResults([]);
        setProgress(0);
        setLogs([]);
        addLog('Encoding process initiated...');

        let parsedCustomMap: Record<string, string> = {};
        if (encodingMethod1 === 'custom' || (doubleEncode && encodingMethod2 === 'custom')) {
            try {
                parsedCustomMap = JSON.parse(customMap);
                if (typeof parsedCustomMap !== 'object' || parsedCustomMap === null) throw new Error("Custom map is not an object.");
                addLog('Custom map parsed successfully.', 'success');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format.';
                addLog(`Error: ${errorMessage} in custom map. Aborting.`, 'error');
                setIsLoading(false);
                return;
            }
        }
        
        const urlsToProcess = inputUrls.split('\n').filter(url => url.trim() !== '');
        const totalUrls = urlsToProcess.length;
        if (totalUrls === 0) {
            addLog('Warning: No URLs to process.', 'warn');
            setIsLoading(false);
            return;
        }

        const newResults: EncodingResult[] = [];

        for (let i = 0; i < totalUrls; i++) {
            const originalUrl = urlsToProcess[i];
            addLog(`Encoding URL ${i + 1}/${totalUrls}: ${originalUrl.substring(0, 50)}...`);

            await new Promise(resolve => setTimeout(resolve, 20)); // Simulate work and allow UI to update

            let encodedUrl = encodeUrlSmart(originalUrl, encodingMethod1, parsedCustomMap);
            if (doubleEncode) {
                encodedUrl = encodeUrlSmart(encodedUrl, encodingMethod2, parsedCustomMap);
            }
            
            newResults.push({ original: originalUrl, encoded: encodedUrl });
            setProgress(((i + 1) / totalUrls) * 100);
        }
        
        setResults(newResults);
        addLog(`Encoding complete. ${totalUrls} URL(s) processed.`, 'success');
        playSound();
        setIsLoading(false);

    }, [inputUrls, encodingMethod1, encodingMethod2, doubleEncode, customMap, addLog, playSound]);

    return (
        <div className="space-y-6">
            <div className="w-full mx-auto flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                    <InputPanel
                        inputUrls={inputUrls}
                        setInputUrls={setInputUrls}
                        encodingMethod1={encodingMethod1}
                        setEncodingMethod1={setEncodingMethod1}
                        encodingMethod2={encodingMethod2}
                        setEncodingMethod2={setEncodingMethod2}
                        doubleEncode={doubleEncode}
                        setDoubleEncode={setDoubleEncode}
                        customMap={customMap}
                        setCustomMap={setCustomMap}
                        onEncode={handleEncode}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:w-1/2">
                    <OutputPanel results={results} />
                </div>
            </div>

            <div className="w-full mx-auto">
                {isLoading && <ProgressBar progress={progress} />}
                <LogPanel logs={logs} />
            </div>
        </div>
    );
};
