import { createContext, useContext, useState } from "react";
import { logoutUser as clearTokens } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const stored = localStorage.getItem("auth_user");

        return stored ? JSON.parse(stored) : null;

    });

    // Call after a successful /login/ response.
    // Expects { user_id, name, role }.
    const login = (userData) => {

        setUser(userData);

        localStorage.setItem("auth_user", JSON.stringify(userData));

    };

    const logout = () => {

        clearTokens();

        localStorage.removeItem("auth_user");

        setUser(null);

    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}