'use client'
import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { Toast } from 'primereact/toast';

type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

type ToastContextType = {
    showToast: (severity: ToastSeverity, summary: string, detail: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const toastRef = useRef<Toast>(null);

    const showToast = (severity: ToastSeverity, summary: string, detail: string) => {
        toastRef.current?.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
};
