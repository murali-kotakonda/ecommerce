import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let idSeq = 0;

/** Lightweight toast provider — success/error notifications without external libs. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success") => {
      const id = ++idSeq;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const api = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  // Fallback to alert if used outside a provider so it never crashes.
  if (!ctx) {
    return {
      success: (m) => window.alert(m),
      error: (m) => window.alert(m),
    };
  }
  return ctx;
}
