
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="w-full bg-slate-200 rounded-full h-2 my-4 overflow-hidden">
            <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};