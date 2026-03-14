import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, deleteUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          // Merge Firebase Auth info with Firestore Profile info (so we get .username)
          setUser({ ...currentUser, ...profile });
        } catch (error) {
          console.error("Error fetching user profile in auth context:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      if (auth.currentUser) {
        // Delete Firestore profile first
        await deleteUserProfile(auth.currentUser.uid);
        // Delete Firebase Auth user
        await deleteUser(auth.currentUser);
        setUser(null);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const value = {
    user,
    logout,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
