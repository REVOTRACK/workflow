
import React, { createContext, useState, useEffect } from 'react';

interface SettingsContextType {
    customLogo: string | null;
    setCustomLogo: (logo: string) => void;
    removeCustomLogo: () => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customLogo, setCustomLogoState] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedLogo = localStorage.getItem('customLogo');
            if (savedLogo) {
                setCustomLogoState(savedLogo);
            }
        } catch (error) {
            console.error("Failed to load logo from localStorage", error);
            localStorage.removeItem('customLogo');
        }
    }, []);

    const setCustomLogo = (logo: string) => {
        localStorage.setItem('customLogo', logo);
        setCustomLogoState(logo);
    };

    const removeCustomLogo = () => {
        localStorage.removeItem('customLogo');
        setCustomLogoState(null);
    };

    return (
        <SettingsContext.Provider value={{ customLogo, setCustomLogo, removeCustomLogo }}>
            {children}
        </SettingsContext.Provider>
    );
};