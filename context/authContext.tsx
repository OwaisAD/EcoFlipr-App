import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "expo-dev-client";
import { Address } from "../stores/addressStore";

export const AuthContext = createContext(
  {} as {
    user: null | {
      firstName: string;
      lastName: string;
      userId: string;
      phoneNumber: string;
      email?: string;
      address: Address;
      profileUrl?: string;
      createdAt?: string;
      savedOffers: string[];
    };
    isAuthenticated: undefined | boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; msg?: any }>;
    register: (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      phoneNumber: string,
      address: any
    ) => Promise<{ success: boolean; data: User; msg?: undefined } | { success: boolean; msg: any; data?: undefined }>;
    logout: () => Promise<
      { success: boolean; msg?: undefined; error?: undefined } | { success: boolean; msg: any; error: any }
    >;
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
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const userData = {
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        userId: data.userId,
        phoneNumber: data.phoneNumber,
        profileUrl: data.profileUrl,
        address: data.address,
        savedOffers: data.savedOffers,
      };

      // Get user data from Firebase Authentication
      const currentUser = auth.currentUser;
      if (currentUser) {
        userData.createdAt = currentUser.metadata.creationTime;
        userData.email = currentUser.email;
      }

      setUser(userData);
    }
  };

  const login = async (email: string, password: string) => {
    // signInWithEmailAndPassword is a Firebase method that signs in the user with the provided email and password.
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) msg = "Invalid credentials";
      return { success: false, msg };
    }
  };

  const googleLogin = async () => {};

  const logout = async () => {
    // signOut is a Firebase method that signs out the current user.
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message, error };
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: any
  ) => {
    // createUserWithEmailAndPassword is a Firebase method that creates a new user with the provided email and password.
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("response.user", response);

      // setUser(response.user);
      // setIsAuthenticated(true);

      // creates a document and returns id?
      await setDoc(doc(db, "users", response.user.uid), {
        userId: response.user.uid,
        firstName,
        lastName,
        address,
        phoneNumber,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedOffers: [],
      });

      return { success: true, data: response.user };
    } catch (error: any) {
      let msg = error.message;

      if (msg.includes("(auth/email-already-in-use)")) msg = "Email already in use";

      return { success: false, msg };
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
