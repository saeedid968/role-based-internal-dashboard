import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (payload) => {
        setToast(payload);
        setTimeout(() => setToast(null), payload.duration || 3000);
    };

    return (
        <UIContext.Provider value={{ toast, showToast }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
