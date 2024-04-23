import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(
  {} as {
    user: any;
    isAuthenticated: undefined | boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string, profileUrl: string) => Promise<void>;
    logout: () => Promise<void>;
  }
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    // onAuthStateChanged is a Firebase method that listens for changes in the user's authentication state.

    setTimeout(() => {
      setIsAuthenticated(false);
    }, 3000);
  }, []);

  const login = async (email: string, password: string) => {
    // signInWithEmailAndPassword is a Firebase method that signs in the user with the provided email and password.
    try {
    } catch (error) {}
  };

  const logout = async () => {
    // signOut is a Firebase method that signs out the current user.
    try {
    } catch (error) {}
  };

  const register = async (email: string, password: string, username: string, profileUrl: string) => {
    // createUserWithEmailAndPassword is a Firebase method that creates a new user with the provided email and password.
    try {
    } catch (error) {}
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return value;
};
