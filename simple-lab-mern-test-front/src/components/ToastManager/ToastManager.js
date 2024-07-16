import { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, variant, delay) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { title, message, variant, delay },
    ]);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer position="bottom-start" className="p-3">
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            onClose={() =>
              setToasts((prevToasts) =>
                prevToasts.filter((_, i) => i !== index)
              )
            }
            delay={toast.delay || 3000}
            autohide
            variant={toast.variant || "info"}
            show
          >
            <Toast.Header>{toast.title}</Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
