
import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md';
    fullWidth?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    fullWidth = false,
    className, 
    ...props 
}) => {
    const baseClasses = 'font-bold rounded-md transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#060b1a] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-cyan-500/10 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,246,0.5)] focus:ring-cyan-400 disabled:hover:shadow-none',
        secondary: 'bg-magenta-500/10 border border-magenta-500 text-magenta-300 hover:bg-magenta-500/20 hover:shadow-[0_0_15px_rgba(255,0,224,0.5)] focus:ring-magenta-400 disabled:hover:shadow-none'
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-5 py-3 text-sm'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
