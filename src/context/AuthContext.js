// src/context/AuthContext.js
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage at app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUserState(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to load user", e);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Save or remove user in storage
    const setUser = async (newUser) => {
        try {
            if (newUser) {
                await AsyncStorage.setItem("user", JSON.stringify(newUser));
            } else {
                await AsyncStorage.removeItem("user");
            }
            setUserState(newUser);
        } catch (e) {
            console.error("Failed to save user", e);
        }
    };

    // Just clear auth – NO navigation here
    const logoutUser = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUserState(null);
            console.log("User logged out successfully");
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
