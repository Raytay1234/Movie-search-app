import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (email) => {
        const newUser = {
            name: email.split("@")[0],
            email,
            avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${email}`,
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/"); // redirect to home after login
    };

    const signup = (email) => {
        const newUser = {
            name: email.split("@")[0],
            email,
            avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${email}`,
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login"); // redirect after logout
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);
