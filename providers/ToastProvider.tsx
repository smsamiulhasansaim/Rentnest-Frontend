'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  loading: (message: string) => string | number;
  dismiss: (id?: string | number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const success = (message: string) => sonnerToast.success(message);
  const error = (message: string) => sonnerToast.error(message);
  const warning = (message: string) => sonnerToast.warning(message);
  const info = (message: string) => sonnerToast.info(message);
  const loading = (message: string) => sonnerToast.loading(message);
  const dismiss = (id?: string | number) => {
    if (id) sonnerToast.dismiss(id);
    else sonnerToast.dismiss();
  };

  return (
    <ToastContext.Provider value={{ success, error, warning, info, loading, dismiss }}>
      {children}
      <Toaster position="top-right" richColors duration={4000} closeButton />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;