import React, { createContext, useContext, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
  confirmDialog: {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null;
  closeConfirm: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => {
    setConfirmDialog({ message, onConfirm, onCancel });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showConfirm,
        toasts,
        removeToast,
        confirmDialog,
        closeConfirm,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
