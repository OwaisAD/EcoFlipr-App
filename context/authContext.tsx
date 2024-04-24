import { User, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext(
  {} as {
    user: null | any;
    isAuthenticated: undefined | boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      phoneNumber: string
    ) => Promise<{ success: boolean; data: User; msg?: undefined } | { success: boolean; msg: any; data?: undefined }>;
    logout: () => Promise<void>;
  }
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    // onAuthStateChanged is a Firebase method that listens for changes in the user's authentication state.
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
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

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    // createUserWithEmailAndPassword is a Firebase method that creates a new user with the provided email and password.
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("response.user", response);

      // setUser(response.user);
      // setIsAuthenticated(true);

      // creates a document and returns id?
      await setDoc(doc(db, "users", response.user.uid), {
        firstName,
        lastName,
        phoneNumber,
        userId: response.user.uid,
      });

      return { success: true, data: response.user };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
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
