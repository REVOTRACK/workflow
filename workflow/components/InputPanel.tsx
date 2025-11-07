
import React from 'react';
import type { EncodingMethod } from '../types';
import { ENCODING_METHODS } from '../constants';
import { Button } from './Button';

interface InputPanelProps {
    inputUrls: string;
    setInputUrls: (value: string) => void;
    encodingMethod1: EncodingMethod;
    setEncodingMethod1: (method: EncodingMethod) => void;
    encodingMethod2: EncodingMethod;
    setEncodingMethod2: (method: EncodingMethod) => void;
    doubleEncode: boolean;
    setDoubleEncode: (value: boolean) => void;
    customMap: string;
    setCustomMap: (value: string) => void;
    onEncode: () => void;
    isLoading: boolean;
}

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 h-full shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 mb-1">{children}</label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
);


export const InputPanel: React.FC<InputPanelProps> = ({
    inputUrls, setInputUrls, encodingMethod1, setEncodingMethod1,
    encodingMethod2, setEncodingMethod2, doubleEncode, setDoubleEncode,
    customMap, setCustomMap, onEncode, isLoading
}) => {
    return (
        <Panel title="Encoder Configuration">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="input-urls">URLs (one per line)</Label>
                    <textarea
                        id="input-urls"
                        value={inputUrls}
                        onChange={(e) => setInputUrls(e.target.value)}
                        rows={8}
                        className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-mono text-sm"
                        placeholder="e.g., https://example.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <Label htmlFor="encoding-method-1">Encoding Method</Label>
                        <Select id="encoding-method-1" value={encodingMethod1} onChange={(e) => setEncodingMethod1(e.target.value as EncodingMethod)}>
                            {ENCODING_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            id="double-encode"
                            type="checkbox"
                            checked={doubleEncode}
                            onChange={(e) => setDoubleEncode(e.target.checked)}
                            className="h-4 w-4 rounded bg-slate-100 border-slate-300 text-green-500 focus:ring-green-500"
                        />
                        <label htmlFor="double-encode" className="text-slate-700">Double Encode</label>
                    </div>
                </div>

                {doubleEncode && (
                    <div className="transition-all duration-300">
                        <Label htmlFor="encoding-method-2">Second Encoding Method</Label>
                        <Select id="encoding-method-2" value={encodingMethod2} onChange={(e) => setEncodingMethod2(e.target.value as EncodingMethod)}>
                            {ENCODING_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </Select>
                    </div>
                )}
                
                {(encodingMethod1 === 'custom' || (doubleEncode && encodingMethod2 === 'custom')) && (
                     <div className="transition-all duration-300">
                        <Label htmlFor="custom-map">Custom Map (JSON)</Label>
                        <textarea
                            id="custom-map"
                            value={customMap}
                            onChange={(e) => setCustomMap(e.target.value)}
                            rows={4}
                            className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-mono text-sm"
                            placeholder='{ "a": "X", "b": "Y" }'
                        />
                    </div>
                )}

                <Button onClick={onEncode} disabled={isLoading} fullWidth size="lg">
                    {isLoading ? 'ENCODING...' : 'EXECUTE ENCODING'}
                </Button>
            </div>
        </Panel>
    );
};