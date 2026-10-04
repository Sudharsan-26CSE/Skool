import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_DURATION = 4000;

const Toast = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 350);
    }, TOAST_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 350);
  };

  const Icon = TOAST_ICONS[toast.type] || Info;

  return (
    <div className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-icon">
        <Icon size={18} />
      </div>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={handleDismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (message, type = 'info', title = '') => {
        console.log(`[Toast ${type}] ${title ? title + ': ' : ''}${message}`);
      },
      dismissToast: () => {}
    };
  }
  return context;
};

export default ToastContext;
