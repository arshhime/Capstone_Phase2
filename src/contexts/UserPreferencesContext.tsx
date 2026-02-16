import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
    theme: 'vs-dark' | 'light';
    fontSize: number;
    submitKeyBinding: string;
}

interface UserPreferencesContextType extends UserPreferences {
    setTheme: (theme: 'vs-dark' | 'light') => void;
    setFontSize: (size: number) => void;
    setSubmitKeyBinding: (binding: string) => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'vs-dark',
    fontSize: 14,
    submitKeyBinding: 'Shift+Enter',
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (!context) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};

interface UserPreferencesProviderProps {
    children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : defaultPreferences;
    });

    useEffect(() => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }, [preferences]);

    const setTheme = (theme: 'vs-dark' | 'light') => {
        setPreferences(prev => ({ ...prev, theme }));
    };

    const setFontSize = (fontSize: number) => {
        setPreferences(prev => ({ ...prev, fontSize }));
    };

    const setSubmitKeyBinding = (submitKeyBinding: string) => {
        setPreferences(prev => ({ ...prev, submitKeyBinding }));
    };

    return (
        <UserPreferencesContext.Provider
            value={{
                ...preferences,
                setTheme,
                setFontSize,
                setSubmitKeyBinding,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
};
