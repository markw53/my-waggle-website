// src/context/AuthContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase'; // Adjust the import path as necessary
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      await sendEmailVerification(userCredential.user, {
        url: 'https://your-app-domain.com/verify-email',
        handleCodeInApp: true,
      });
      return userCredential.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert('Check your email for password reset instructions');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      setLoading(true);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, updates);
        setUser(prevUser => ({ ...prevUser, ...updates }));
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setLoading(true);
      if (auth.currentUser) {
        await auth.currentUser.reload();
        return auth.currentUser.emailVerified;
      }
      return false;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser, {
          url: 'https://your-app-domain.com/verify-email',
          handleCodeInApp: true,
        });
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  // Error message handler
  const getErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/operation-not-allowed':
            return 'Operation not allowed';
        case 'auth/weak-password':
            return 'Password is too weak';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/invalid-verification-code':
            return 'Invalid verification code';
        case 'auth/invalid-verification-id':
            return 'Invalid verification ID';
        case 'auth/invalid-credential':
            return 'Invalid credentials';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Authentication cancelled by user';
        case 'auth/requires-recent-login':
            return 'Please log in again to complete this action';
        case 'auth/email-already-verified':
            return 'Email is already verified';
        case 'auth/invalid-action-code':
            return 'Invalid verification link. Please request a new one';
        case 'auth/expired-action-code':
            return 'Verification link has expired. Please request a new one';
        default:
            return error.message || 'An error occurred during authentication';
    }
};

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    signupWithGoogle,
    resetPassword,
    updateUserProfile,
    clearAuthData,
    verifyEmail,
    sendVerificationEmail,
    isEmailVerified: auth.currentUser?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;