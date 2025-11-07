
import React from 'react';
import { useSettings } from '../../hooks/useSettings';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    const { customLogo } = useSettings();

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div 
                className="w-10 h-10 bg-white rounded-md flex items-center justify-center flex-shrink-0"
            >
                {customLogo ? (
                    <img src={customLogo} alt="Custom Logo" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4V20H13V14H16C18.7614 14 21 11.7614 21 9C21 6.23858 18.7614 4 16 4H9ZM13 8H15.5C16.8807 8 18 9.11929 18 10.5C18 11.8807 16.8807 13 15.5 13H13V8Z" fill="black"/>
                    </svg>
                )}
            </div>
            <span className="text-xl font-bold text-white">Encoder Station</span>
        </div>
    );
};