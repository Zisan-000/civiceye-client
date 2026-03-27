import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const AuthContext = createContext();

const auth = getAuth(app);
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [user, setUser] = useState(null);
  //   console.log(user);
  const refreshDbUser = async (email) => {
    if (!email) {
      // console.error("❌ refreshDbUser Error: No email provided!");
      return;
    }

    try {
      // console.log(`📡 Fetching data for: ${email}...`);

      const res = await fetch(`http://localhost:1069/api/users/${email}`);

      // console.log("📥 Response Status:", res.status);

      if (!res.ok) {
        // console.error("❌ Server returned an error:", res.statusText);
        return;
      }

      const data = await res.json();

      // 1. Log the entire object to see the structure
      // console.log("📦 Full Data Object from DB:", data);

      // 2. Check if trustScore exists and what its TYPE is
      if (data && data.trustScore !== undefined) {
        // console.log("✅ Trust Score Found:", data.trustScore);
        // console.log("🔢 Type of Trust Score:", typeof data.trustScore);
      } else {
        // console.warn(
        //   "⚠️ Warning: 'trustScore' property is missing in the returned object!",
        // );
        // console.log("Keys available in data:", Object.keys(data || {}));
      }

      setDbUser(data);
    } catch (err) {
      console.error("🔥 Network/Connection Error:", err);
    }
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 1. Set the firebase user
      setUser(currentUser);

      // 2. ONLY fetch from DB if the user is actually logged in
      if (currentUser && currentUser.email) {
        refreshDbUser(currentUser.email);
      } else {
        // Clear the DB user if no one is logged in
        setDbUser(null);
      }

      // 3. Set loading to false only after we've handled the user state
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authData = {
    user,
    setUser,
    createUser,
    logout,
    login,
    googleLogin,
    refreshDbUser,
    dbUser,
    loading,
  };
  return <AuthContext value={authData}> {children} </AuthContext>;
};

export { AuthContext };
export default AuthProvider;
