import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { ApiClient } from '../utils/apiConfig';

interface MongoUser {
  _id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

useEffect(() => {
  const fetchMongoUser = async () => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const userData = await ApiClient.get<MongoUser>(`/DB_Routes/user/${user.uid}`, token);
        setMongoUser(userData);
      } catch (error) {
        console.error('Failed to fetch MongoDB user:', error);
        setMongoUser(null);
      }
    } else {
      setMongoUser(null);
    }
  };
  fetchMongoUser();
}, [user]);

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // 1. Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Update Firebase profile
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Create MongoDB user
      await createMongoDBUser({
        uid: result.user.uid,
        email,
        firstName,
        lastName,
      });

      return result;
    } catch (error) {
      // If MongoDB creation fails, delete Firebase user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      
      // Create MongoDB user for Google sign-in
      const names = user.displayName?.split(' ') || ['', ''];
      await createMongoDBUser({
        uid: user.uid,
        email: user.email || '',
        firstName: names[0],
        lastName: names[1] || '',
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    return signOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const confirmPasswordResetCode = async (code: string, newPassword: string) => {
    return confirmPasswordReset(auth, code, newPassword);
  };

  const getIdToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const createMongoDBUser = async (userData: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await ApiClient.post<ApiResponse<MongoUser>>('/DB_Routes/createuser', userData);
      if (!response.success) {
        throw new Error(response.message || "Failed to create user in MongoDB");
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create MongoDB user:', error);
      throw new Error("Failed to create user in MongoDB");
    }
  };

  return {
    user,
    mongoUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  , sendPasswordReset, confirmPasswordResetCode, getIdToken
  };
};