import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // 🔥 key

  // Load auth state on app boot
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  // Simulated async login (realistic)
  const login = ({ role, email }) => {
    return new Promise((resolve) => {
      setAuthLoading(true);

      setTimeout(() => {
        const userData = { role, email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthLoading(false);
        resolve(userData);
      }, 1000); // 👈 realistic delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
