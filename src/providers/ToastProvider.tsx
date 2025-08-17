import React, { type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';
import { ToastContext, type ToastContextType } from '~/context/toast-context';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const success = (
    message: string,
    options?: Parameters<typeof toast.success>[1]
  ) => {
    toast.success(message, options);
  };

  const error = (
    message: string,
    options?: Parameters<typeof toast.error>[1]
  ) => {
    toast.error(message, options);
  };

  const warning = (
    message: string,
    options?: Parameters<typeof toast.warning>[1]
  ) => {
    toast.warning(message, options);
  };

  const info = (
    message: string,
    options?: Parameters<typeof toast.info>[1]
  ) => {
    toast.info(message, options);
  };

  const loading = (
    message: string,
    options?: Parameters<typeof toast.loading>[1]
  ) => {
    return toast.loading(message, options);
  };

  const dismiss = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  const value: ToastContextType = {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        expand={true}
      />
    </ToastContext.Provider>
  );
};
